import { useState, useRef } from 'react';
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { uploadFileToStorage } from '../../lib/storageService';
import { soundEngine } from '../../utils/soundEffects';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: 'projects' | 'certificates' | 'profile' | 'seo';
  label?: string;
  aspectRatio?: 'video' | 'square' | 'certificate' | 'auto';
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder = 'projects',
  label,
  aspectRatio = 'video',
  className = '',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    setError(null);
    setUploadStatus(null);

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP, etc.).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('Image exceeds 20 MB. Please choose a smaller image.');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Optimizing and uploading to Cloudinary...');
    soundEngine.playClick();

    try {
      const result = await uploadFileToStorage(file, folder);

      // Never accept a non-Cloudinary upload result.
      if (
        result.source !== 'cloudinary' ||
        !result.url.startsWith('https://')
      ) {
        throw new Error(
          'The image was not uploaded to Cloudinary. Please try again.'
        );
      }

      onChange(result.url);
      setUploadStatus('Image uploaded to Cloudinary successfully!');
      soundEngine.playChime(659.25);

      window.setTimeout(() => {
        setUploadStatus(null);
      }, 4000);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Cloudinary upload failed. Please try again.';

      setError(message);
      setUploadStatus(null);
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'certificate':
        return 'aspect-[4/3]';
      case 'auto':
        return 'min-h-[140px]';
      default:
        return 'aspect-video';
    }
  };

  const applyExternalUrl = () => {
    const url = externalUrl.trim();

    if (!url) {
      setError('Please enter an image URL.');
      return;
    }

    try {
      const parsed = new URL(url);

      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        throw new Error('Invalid protocol');
      }

      onChange(parsed.href);
      setError(null);
      setUploadStatus('External image URL applied.');
      setShowUrlInput(false);
    } catch {
      setError('Please enter a valid HTTP or HTTPS image URL.');
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-300">
            <ImageIcon className="h-3.5 w-3.5 text-sky-400" />
            <span>{label}</span>
          </label>

          {value && value.includes('res.cloudinary.com') && (
            <span className="flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-950/80 px-2 py-0.5 text-[10px] font-mono text-sky-400">
              <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
              Cloudinary
            </span>
          )}
        </div>
      )}

      {value ? (
        <div className="space-y-3 rounded-2xl border border-sky-500/30 bg-slate-950/80 p-3">
          <div
            className={`relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-black ${getAspectClass()}`}
          >
            <img
              src={value}
              alt="Image preview"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />

            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/75 text-white">
                <RefreshCw className="h-6 w-6 animate-spin text-sky-400" />
                <span className="text-xs font-mono text-sky-300">
                  Uploading to Cloudinary...
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-sky-500 px-3 py-1.5 text-xs font-bold font-mono text-slate-950 transition-colors hover:bg-sky-400">
                <Upload className="h-3.5 w-3.5" />
                <span>{isUploading ? 'Uploading...' : 'Replace Image'}</span>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleFile(file);
                  }}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                disabled={isUploading}
                onClick={() => {
                  soundEngine.playClick();
                  onChange('');
                  setError(null);
                  setUploadStatus(null);
                  setExternalUrl('');
                }}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-mono text-rose-300 transition-colors hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="cursor-pointer text-[10px] font-mono text-slate-400 underline underline-offset-2 hover:text-slate-300"
            >
              {showUrlInput ? 'Hide link details' : 'Link details'}
            </button>
          </div>

          {showUrlInput && (
            <div className="flex items-center gap-2 border-t border-slate-800/80 pt-3">
              <span className="shrink-0 text-[10px] font-mono text-slate-400">
                Image URL:
              </span>

              <input
                type="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="min-w-0 flex-1 rounded border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] font-mono text-slate-300 focus:border-sky-400 focus:outline-none"
              />
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => {
            if (!isUploading) fileInputRef.current?.click();
          }}
          className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-500/40 bg-slate-950/60 p-6 text-center transition-all duration-200 hover:border-sky-400 hover:bg-slate-900/40"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
            disabled={isUploading}
            className="hidden"
          />

          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-500/10 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.15)] transition-transform group-hover:scale-105">
            {isUploading ? (
              <RefreshCw className="h-6 w-6 animate-spin" />
            ) : (
              <Upload className="h-6 w-6 transition-transform group-hover:-translate-y-0.5" />
            )}
          </div>

          <p className="mb-1 text-xs font-mono font-semibold text-slate-200">
            {isUploading
              ? 'Uploading image...'
              : 'Click or drag and drop an image'}
          </p>

          <p className="text-[11px] font-mono text-slate-400">
            Images upload to Cloudinary. The CMS saves the image URL.
          </p>

          <p className="mt-1 text-[10px] font-mono text-slate-500">
            PNG, JPG, WebP, GIF · Maximum 20 MB
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowUrlInput(!showUrlInput);
              setError(null);
            }}
            className="mt-3 cursor-pointer text-[10px] font-mono text-sky-400 underline underline-offset-2 hover:text-sky-300"
          >
            {showUrlInput ? 'Close URL input' : 'Use an external image URL'}
          </button>

          {showUrlInput && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-3 flex w-full max-w-md gap-2"
            >
              <input
                type="url"
                value={externalUrl}
                placeholder="https://..."
                onChange={(e) => setExternalUrl(e.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-mono text-white focus:border-sky-400 focus:outline-none"
              />

              <button
                type="button"
                onClick={applyExternalUrl}
                className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-sky-400"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}

      {uploadStatus && (
        <div className="flex items-center gap-1 px-1 text-[11px] font-mono text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>{uploadStatus}</span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-1 px-1 text-[11px] font-mono text-rose-400"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
