import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  ArrowLeft,
  ShieldCheck,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { auth, ADMIN_AUTH_UID } from '../../lib/firebase';
import { soundEngine } from '../../utils/soundEffects';

interface AdminLoginProps {
  onSuccess: () => void;
  onExit: () => void;
}

export function AdminLogin({
  onSuccess,
  onExit,
}: AdminLoginProps) {
  const [accessKey, setAccessKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError(null);

    const password = accessKey.trim();

    if (!password) {
      setError('Please enter your admin password.');
      return;
    }

    setLoading(true);
    soundEngine.playClick();

    try {
      // Authenticate through Firebase Authentication.
      const credential = await signInWithEmailAndPassword(
        auth,
        'saheera006@gmail.com',
        password
      );

      // Verify the Firebase account UID.
      if (credential.user.uid !== ADMIN_AUTH_UID) {
        await signOut(auth);
        setError(
          'This account is not authorized to access the admin console.'
        );
        return;
      }

      // Store the UI session flag only after Firebase login succeeds.
      sessionStorage.setItem(
        'saheera_admin_authenticated',
        'true'
      );

      soundEngine.playChime(659.25);
      onSuccess();
    } catch (err: unknown) {
      console.error('[AdminLogin] Firebase login failed:', err);

      const firebaseError = err as { code?: string };

      if (
        firebaseError.code === 'auth/invalid-credential' ||
        firebaseError.code === 'auth/wrong-password' ||
        firebaseError.code === 'auth/user-not-found' ||
        firebaseError.code === 'auth/invalid-email'
      ) {
        setError(
          'Invalid Firebase admin email or password. Please try again.'
        );
      } else if (
        firebaseError.code === 'auth/too-many-requests'
      ) {
        setError(
          'Too many login attempts. Please wait and try again later.'
        );
      } else if (
        firebaseError.code === 'auth/network-request-failed'
      ) {
        setError(
          'Network error. Check your internet connection and try again.'
        );
      } else {
        setError(
          'Unable to sign in. Check Firebase Authentication settings and try again.'
        );
      }

      soundEngine.playClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-sky-500/30 selection:text-sky-200">
      {/* Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 blur-[140px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#090d18]/95 border border-sky-500/30 shadow-2xl backdrop-blur-2xl space-y-6"
      >
        {/* Return to portfolio */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onExit}
            disabled={loading}
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio</span>
          </button>

          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-sky-950/80 border border-sky-400/40 text-sky-400 font-bold">
            ADMIN AUTH ONLY
          </span>
        </div>

        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.2)]">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans uppercase">
            Admin Authentication
          </h1>

          <p className="text-xs text-slate-400 font-sans">
            Authorized management console for Fathima Saheera J
          </p>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 font-sans"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <label
                htmlFor="admin-key"
                className="text-slate-300 flex items-center gap-1.5 font-semibold"
              >
                <Key className="w-3.5 h-3.5 text-sky-400" />
                <span>Admin Password:</span>
              </label>
            </div>

            <div className="relative">
              <input
                id="admin-key"
                type={showKey ? 'text' : 'password'}
                value={accessKey}
                onChange={(e) => {
                  setAccessKey(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter Firebase admin password"
                autoFocus
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 text-sm font-mono transition-colors disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowKey((value) => !value)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1 disabled:opacity-50"
                title={showKey ? 'Hide password' : 'Show password'}
                aria-label={showKey ? 'Hide password' : 'Show password'}
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-slate-950 font-bold font-mono text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {loading
                ? 'VERIFYING CREDENTIALS...'
                : 'UNLOCK ADMIN CONSOLE'}
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>
            Account:{' '}
            <span className="text-sky-400">
              saheera006@gmail.com
            </span>
          </span>

          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Firebase Auth
          </span>
        </div>
      </motion.div>
    </div>
  );
}
