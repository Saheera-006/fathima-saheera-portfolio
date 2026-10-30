import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, ShieldCheck, ExternalLink, Maximize2, Download, CheckCircle2, ZoomIn } from 'lucide-react';
import { CertificationItem } from '../data/portfolioData';

interface CertificateModalProps {
  certificate: CertificationItem | null;
  onClose: () => void;
}

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!certificate) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl rounded-3xl border border-sky-500/30 bg-[#080d19]/95 backdrop-blur-xl shadow-2xl p-6 sm:p-7 z-10 space-y-5 text-slate-200 max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-sky-950/60 border border-sky-500/30 text-sky-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block">
                  Official Credential Verification
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Completion &bull; {certificate.issuer}</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {certificate.title}
              </h3>
              <p className="text-xs font-mono text-sky-300">
                Issued by {certificate.issuer} {certificate.date ? `• ${certificate.date}` : ''}
              </p>
            </div>

            {/* Certificate Display Window */}
            {certificate.imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-sky-500/30 bg-black/80 flex items-center justify-center shadow-inner group min-h-[220px]">
                <img
                  src={certificate.imageUrl}
                  alt={certificate.title}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[420px] object-contain rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setIsZoomed(true)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 hover:bg-sky-500 text-slate-300 hover:text-slate-950 border border-slate-700/80 transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-lg"
                  title="Enlarge certificate"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-sky-500/30 bg-sky-950/10 text-center space-y-2">
                <Award className="w-10 h-10 text-sky-400 mx-auto opacity-60" />
                <p className="text-sm font-semibold text-slate-200">
                  Digital Certificate Document
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Certificate record verified on official student records and original portfolio.
                </p>
              </div>
            )}

            {/* Credential Attributes */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs font-sans text-slate-300">
              <div className="flex justify-between font-mono text-[11px] text-slate-400 pb-2 border-b border-slate-800/80">
                <span>Specialization Domain:</span>
                <span className="text-slate-200 font-semibold">{certificate.category}</span>
              </div>
              <div className="flex justify-between font-mono text-[11px] text-slate-400 pb-2 border-b border-slate-800/80">
                <span>Issuing Organization:</span>
                <span className="text-sky-300">{certificate.issuer}</span>
              </div>
              <div className="flex justify-between font-mono text-[11px] text-slate-400">
                <span>Credential Status:</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Officially Verified Completion</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Official digital certificate record verified for Fathima Saheera J.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
            >
              Close
            </button>

            {certificate.imageUrl && (
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>FULLSCREEN VIEW</span>
              </button>
            )}

            {certificate.certificateUrl && !certificate.certificateUrl.includes('wixsite.com') && (
              <a
                href={certificate.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-sky-500/20"
              >
                <span>VERIFY CREDENTIAL</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Fullscreen Certificate Zoom */}
        {isZoomed && certificate.imageUrl && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg"
            onClick={() => setIsZoomed(false)}
          >
            <div className="relative max-w-5xl max-h-[92vh] w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-full flex items-center justify-between pb-3 text-white">
                <span className="text-xs font-mono text-sky-400">
                  {certificate.title} &bull; {certificate.issuer}
                </span>
                <button
                  type="button"
                  onClick={() => setIsZoomed(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <img
                src={certificate.imageUrl}
                alt={certificate.title}
                referrerPolicy="no-referrer"
                className="max-h-[85vh] w-auto max-w-full rounded-2xl border border-sky-500/30 object-contain shadow-2xl bg-black"
              />
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}

