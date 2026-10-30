import { useState } from 'react';
import {
  Cloud,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Upload,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  getCloudinaryPreset,
  setCloudinaryPreset,
  uploadToCloudinary,
} from '../../lib/storageService';
import { CLOUDINARY_CLOUD_NAME } from '../../lib/firebase';
import { soundEngine } from '../../utils/soundEffects';

interface CloudStorageSettingsProps {
  syncStatus: 'loading' | 'synced' | 'saving' | 'error' | 'offline';
  onShowToast: (msg: string) => void;
}

const REQUIRED_PRESET = 'mknktvsv';

export function CloudStorageSettings({
  syncStatus,
  onShowToast,
}: CloudStorageSettingsProps) {
  const [preset, setPreset] = useState(
    () => getCloudinaryPreset() || REQUIRED_PRESET
  );
  const [savingPreset, setSavingPreset] = useState(false);
  const [testingCloudinary, setTestingCloudinary] = useState(false);
  const [cloudinaryTestResult, setCloudinaryTestResult] =
    useState<string | null>(null);
  const [testSucceeded, setTestSucceeded] = useState<boolean | null>(null);

  const handleSavePreset = () => {
    soundEngine.playClick();

    const cleanPreset = preset.trim();

    if (!cleanPreset) {
      setTestSucceeded(false);
      setCloudinaryTestResult('Please enter your Cloudinary upload preset.');
      return;
    }

    setSavingPreset(true);
    setCloudinaryPreset(cleanPreset);
    setPreset(cleanPreset);
    setCloudinaryTestResult(null);
    setTestSucceeded(null);

    window.setTimeout(() => {
      setSavingPreset(false);
      onShowToast(`Cloudinary preset saved: "${cleanPreset}"`);
    }, 300);
  };

  const handleTestCloudinary = async () => {
    soundEngine.playClick();
    setTestingCloudinary(true);
    setCloudinaryTestResult(null);
    setTestSucceeded(null);

    try {
      const cleanPreset = preset.trim();

      if (!CLOUDINARY_CLOUD_NAME?.trim()) {
        throw new Error('Cloudinary cloud name is not configured.');
      }

      if (!cleanPreset) {
        throw new Error('Enter your unsigned upload preset first.');
      }

      // A small valid PNG is used to test the Cloudinary upload.
      const base64 =
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const testFile = new File([bytes], 'cloudinary-connection-test.png', {
        type: 'image/png',
      });

      const result = await uploadToCloudinary(testFile, cleanPreset);

      if (!result?.url) {
        throw new Error(
          'Cloudinary upload failed. Verify that the preset name is correct and its signing mode is Unsigned, then try again.'
        );
      }

      setCloudinaryPreset(cleanPreset);
      setPreset(cleanPreset);
      setTestSucceeded(true);
      setCloudinaryTestResult(
        `Connection successful! Test image uploaded to Cloudinary. Public ID: ${result.publicId || 'Created successfully'}`
      );
      soundEngine.playChime(659.25);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Cloudinary connection test failed. Please try again.';

      setTestSucceeded(false);
      setCloudinaryTestResult(message);
    } finally {
      setTestingCloudinary(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="flex items-center gap-2 text-xl font-bold font-sans uppercase tracking-tight text-white">
          <Cloud className="h-5 w-5 text-sky-400" />
          <span>Cloud Storage &amp; Database Hub</span>
        </h2>

        <p className="text-xs font-mono text-slate-400">
          Firestore stores CMS content and Cloudinary URLs. Cloudinary hosts
          uploaded images.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {/* Firebase Firestore: database only */}
        <section className="space-y-4 rounded-2xl border border-sky-500/30 bg-slate-950/80 p-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/10 text-sky-400">
                <Database className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold font-mono text-white">
                  Firebase Firestore
                </h3>
                <p className="text-[10px] font-mono text-slate-400">
                  CMS database only
                </p>
              </div>
            </div>

            <span
              className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold font-mono ${
                syncStatus === 'synced'
                  ? 'border-emerald-500/40 bg-emerald-950/80 text-emerald-400'
                  : syncStatus === 'saving' || syncStatus === 'loading'
                    ? 'border-amber-500/40 bg-amber-950/80 text-amber-400'
                    : 'border-rose-500/40 bg-rose-950/80 text-rose-400'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  syncStatus === 'synced'
                    ? 'bg-emerald-400'
                    : syncStatus === 'saving' || syncStatus === 'loading'
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                }`}
              />
              {syncStatus === 'synced'
                ? 'Synced'
                : syncStatus === 'saving' || syncStatus === 'loading'
                  ? 'Syncing'
                  : 'Offline'}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between gap-4 border-b border-slate-800/60 py-2">
              <span className="text-slate-400">Database</span>
              <span className="text-right text-slate-200">Cloud Firestore</span>
            </div>

            <div className="flex items-center justify-between gap-4 border-b border-slate-800/60 py-2">
              <span className="text-slate-400">Purpose</span>
              <span className="text-right text-sky-300">
                CMS content and image URLs
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 py-2">
              <span className="text-slate-400">Firebase Storage</span>
              <span className="text-right text-emerald-400">Not used for uploads</span>
            </div>
          </div>
        </section>

        {/* Cloudinary: image hosting */}
        <section className="space-y-4 rounded-2xl border border-sky-500/30 bg-slate-950/80 p-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/10 text-sky-400">
                <Cloud className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold font-mono text-white">
                  Cloudinary CDN
                </h3>
                <p className="text-[10px] font-mono text-slate-400">
                  Image upload and delivery
                </p>
              </div>
            </div>

            <span className="rounded-full border border-sky-500/40 bg-sky-950/80 px-2.5 py-0.5 text-[10px] font-bold font-mono text-sky-400">
              Image Hosting
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between gap-4 border-b border-slate-800/60 py-2">
              <span className="text-slate-400">Cloud name</span>
              <span className="text-sky-300">{CLOUDINARY_CLOUD_NAME}</span>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="cloudinary-preset"
                className="block text-[11px] text-slate-400"
              >
                Unsigned upload preset
              </label>

              <div className="flex items-center gap-2">
                <input
                  id="cloudinary-preset"
                  type="text"
                  value={preset}
                  onChange={(e) => {
                    setPreset(e.target.value);
                    setCloudinaryTestResult(null);
                    setTestSucceeded(null);
                  }}
                  placeholder="mknktvsv"
                  className="min-w-0 flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-mono text-white focus:border-sky-400 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={handleSavePreset}
                  disabled={savingPreset || !preset.trim()}
                  className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-bold font-mono text-slate-950 transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingPreset ? 'Saving...' : 'Save'}
                </button>
              </div>

              <p className="text-[10px] leading-relaxed text-slate-500">
                Enter the preset name from your Cloudinary dashboard. Make sure
                its signing mode is set to Unsigned.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestCloudinary}
            disabled={testingCloudinary || !preset.trim()}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 py-2.5 text-xs font-mono text-slate-200 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {testingCloudinary ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-sky-400" />
                Testing Cloudinary...
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5 text-sky-400" />
                Test Cloudinary Upload
              </>
            )}
          </button>

          {cloudinaryTestResult && (
            <div
              role="status"
              className={`flex items-start gap-2 rounded-lg border p-3 text-[11px] font-mono ${
                testSucceeded
                  ? 'border-emerald-500/20 bg-emerald-950/30 text-emerald-400'
                  : 'border-rose-500/20 bg-rose-950/30 text-rose-300'
              }`}
            >
              {testSucceeded ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}

              <span className="break-words">{cloudinaryTestResult}</span>
            </div>
          )}

          <a
            href="https://console.cloudinary.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-sky-400 hover:text-sky-300"
          >
            Open Cloudinary Dashboard
            <ExternalLink className="h-3 w-3" />
          </a>
        </section>
      </div>

      {/* Upload workflow */}
      <div className="space-y-2 rounded-2xl border border-sky-500/20 bg-sky-950/30 p-4 text-xs font-mono text-slate-300">
        <h4 className="flex items-center gap-2 font-bold text-sky-300">
          <Sparkles className="h-4 w-4 text-sky-400" />
          Image upload workflow
        </h4>

        <p className="text-[11px] leading-relaxed text-slate-400">
          Images are optimized and uploaded to Cloudinary. The returned secure
          image URL is then saved with your CMS content in Firestore. If
          Cloudinary upload fails, an error is shown instead of silently
          falling back to Firebase Storage or Base64.
        </p>
      </div>
    </div>
  );
}
