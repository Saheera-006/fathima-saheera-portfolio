import { CLOUDINARY_CLOUD_NAME } from './firebase';

const CLOUDINARY_PRESET_STORAGE_KEY =
  'saheera_cloudinary_upload_preset';

const DEFAULT_CLOUDINARY_PRESET = 'mknktvsv';
const CLOUDINARY_TIMEOUT_MS = 30_000;
const MAX_IMAGE_DIMENSION = 1800;
const IMAGE_QUALITY = 0.82;
const MAX_FILE_SIZE = 20 * 1024 * 1024;

export type UploadSource = 'cloudinary';

export interface UploadResult {
  url: string;
  source: UploadSource;
  error?: string;
}

type UploadFolder =
  | 'projects'
  | 'certificates'
  | 'resume'
  | 'profile'
  | 'seo';

const ALLOWED_FOLDERS: UploadFolder[] = [
  'projects',
  'certificates',
  'resume',
  'profile',
  'seo',
];

export function getCloudinaryPreset(): string {
  if (typeof window === 'undefined') {
    return DEFAULT_CLOUDINARY_PRESET;
  }

  return (
    localStorage.getItem(CLOUDINARY_PRESET_STORAGE_KEY)?.trim() ||
    DEFAULT_CLOUDINARY_PRESET
  );
}

export function setCloudinaryPreset(preset: string): void {
  if (typeof window === 'undefined') return;

  const cleanPreset = preset.trim();

  if (!cleanPreset) {
    throw new Error('Cloudinary upload preset cannot be empty.');
  }

  localStorage.setItem(CLOUDINARY_PRESET_STORAGE_KEY, cleanPreset);
}

/**
 * Optimize supported raster images before uploading.
 * GIF and SVG files are preserved to avoid damaging animation
 * or changing vector graphics.
 */
export async function optimizeImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) {
    return file;
  }

  if (
    file.type === 'image/gif' ||
    file.type === 'image/svg+xml'
  ) {
    return file;
  }

  if (file.type === 'image/webp' && file.size < 250 * 1024) {
    return file;
  }

  if (typeof document === 'undefined') {
    throw new Error('Image optimization is only available in a browser.');
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.src = imageUrl;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(new Error('Unable to read the selected image.'));
    });

    if (!image.naturalWidth || !image.naturalHeight) {
      throw new Error('The selected image has invalid dimensions.');
    }

    const scale = Math.min(
      1,
      MAX_IMAGE_DIMENSION / image.naturalWidth,
      MAX_IMAGE_DIMENSION / image.naturalHeight
    );

    const width = Math.max(
      1,
      Math.round(image.naturalWidth * scale)
    );
    const height = Math.max(
      1,
      Math.round(image.naturalHeight * scale)
    );

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Unable to initialize image optimization.');
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) resolve(result);
          else reject(new Error('Image optimization failed.'));
        },
        'image/webp',
        IMAGE_QUALITY
      );
    });

    // Preserve the original if WebP does not reduce the file size.
    if (blob.size >= file.size) {
      return file;
    }

    const baseName = file.name.replace(/\.[^.]+$/, '');

    return new File([blob], `${baseName}.webp`, {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

/**
 * Upload directly to Cloudinary using an unsigned upload preset.
 * Throws a meaningful error when the upload fails.
 */
export async function uploadToCloudinary(
  file: File | Blob,
  customPreset?: string
): Promise<{ url: string; publicId: string }> {
  const cloudName = CLOUDINARY_CLOUD_NAME?.trim();
  const preset = (
    customPreset?.trim() || getCloudinaryPreset()
  ).trim();

  if (!cloudName) {
    throw new Error('Cloudinary cloud name is not configured.');
  }

  if (!preset) {
    throw new Error('Cloudinary upload preset is missing.');
  }

  const endpoint =
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    let timedOut = false;

    const timeoutId = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, CLOUDINARY_TIMEOUT_MS);

    try {
      const formData = new FormData();
      formData.append('file', file, 'upload-image');
      formData.append('upload_preset', preset);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          result?.error?.message ||
          `Cloudinary upload failed (HTTP ${response.status}).`;

        throw new Error(message);
      }

      if (
        typeof result?.secure_url !== 'string' ||
        !result.secure_url.startsWith('https://')
      ) {
        throw new Error('Cloudinary did not return a secure image URL.');
      }

      // Save the preset only after a successful upload.
      setCloudinaryPreset(preset);

      return {
        url: result.secure_url,
        publicId: result.public_id || '',
      };
    } catch (error: unknown) {
      if (timedOut) {
        lastError = new Error(
          'Cloudinary upload timed out. Check your connection and try again.'
        );
      } else {
        lastError =
          error instanceof Error
            ? error
            : new Error(String(error));
      }

      // Retry transient failures only, not configuration errors.
      const permanentError =
        /upload preset|invalid|not allowed|unsigned|HTTP 400|HTTP 401|HTTP 403/i.test(
          lastError.message
        );

      if (permanentError || attempt === 1) {
        break;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 700));
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  console.error('Cloudinary upload failed:', lastError?.message);
  throw lastError || new Error('Cloudinary upload failed.');
}

/**
 * Compatibility wrapper for existing CMS upload components.
 * Images go to Cloudinary only. There is no Firebase Storage
 * fallback and no Base64 fallback.
 */
export async function uploadFileToStorage(
  originalFile: File,
  folder: UploadFolder = 'projects'
): Promise<UploadResult> {
  if (!ALLOWED_FOLDERS.includes(folder)) {
    throw new Error('Invalid upload folder.');
  }

  if (!originalFile.size) {
    throw new Error('The selected file is empty.');
  }

  if (originalFile.size > MAX_FILE_SIZE) {
    throw new Error(
      'File size exceeds 20 MB. Please choose a smaller file.'
    );
  }

  if (!originalFile.type.startsWith('image/')) {
    throw new Error('Only image uploads are supported by this uploader.');
  }

  const optimizedFile = await optimizeImage(originalFile);
  const result = await uploadToCloudinary(optimizedFile);

  return {
    url: result.url,
    source: 'cloudinary',
  };
}
