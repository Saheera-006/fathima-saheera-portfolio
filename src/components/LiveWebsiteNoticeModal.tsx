import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { ProjectData } from '../data/portfolioData';

interface LiveWebsiteNoticeModalProps {
  project: ProjectData | null;
  onClose: () => void;
  onExploreSpec: () => void;
}

export function LiveWebsiteNoticeModal({ project, onClose, onExploreSpec }: LiveWebsiteNoticeModalProps) {
  if (!project) return null;

  const hasLiveUrl = project.liveUrl && project.liveUrl !== '#' && project.liveUrl.startsWith('http');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md rounded-3xl border border-sky-500/30 bg-[#080d19]/95 backdrop-blur-xl shadow-2xl p-6 sm:p-8 z-10 space-y-5 text-slate-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-sky-950/60 border border-sky-500/30 text-sky-400">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block">
                  Production Deployment
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {project.title} Live Gateway
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-sans text-slate-300">
            <div className="flex items-center gap-2 text-sky-300 font-mono text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Project Authentically Built &amp; Delivered</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Fathima engineered this platform for real-world user workflows and event operations.
              {hasLiveUrl
                ? ' Live production URL is ready to open.'
                : ' Production URLs can be linked directly in portfolioData.ts.'}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onExploreSpec();
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors"
            >
              Explore Architecture
            </button>

            {hasLiveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs tracking-wider transition-colors flex items-center gap-1.5"
              >
                <span>OPEN LIVE WEBSITE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs tracking-wider transition-colors"
              >
                Understood
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
