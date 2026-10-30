import { Award, ArrowRight, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import { PORTFOLIO_DATA, CertificationItem } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { soundEngine } from '../utils/soundEffects';

interface CertificationsSectionProps {
  onViewCertificate: (cert: CertificationItem) => void;
  onViewAllCertificates?: () => void;
}

export function CertificationsSection({ onViewCertificate, onViewAllCertificates }: CertificationsSectionProps) {
  const { data } = usePortfolio();
  const certifications = data?.certifications || PORTFOLIO_DATA.certifications;
  // Brief display on home: top 4 featured certificates
  const briefCertificates = certifications.slice(0, 4);

  return (
    <section
      id="certifications"
      className="relative py-24 px-4 sm:px-6 lg:px-8 z-10"
    >
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/50 border border-sky-500/20 text-sky-400 font-mono text-xs">
              <Award className="w-3.5 h-3.5" />
              <span>FEATURED CREDENTIALS // BRIEF PREVIEW</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              Certifications & Simulations
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl">
              Structured industry-backed training across programming foundations, software engineering simulations, and data analysis.
            </p>
          </div>

          {onViewAllCertificates && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onViewAllCertificates();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 hover:border-sky-400 text-sky-300 hover:text-white font-mono text-xs transition-all shadow-sm w-fit cursor-pointer hover:scale-105 active:scale-95"
              title="Open full dedicated certificates vault"
            >
              <span>VIEW ALL CERTIFICATES ({certifications.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Brief Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {briefCertificates.map((cert) => (
            <div
              key={cert.id}
              className="p-5 rounded-2xl border border-sky-500/15 bg-gradient-to-b from-[#080d1a]/80 to-[#04070e] backdrop-blur-md hover:border-sky-400/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-950/60 border border-sky-500/30 text-[10px] font-mono text-sky-300">
                    {cert.issuer}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-white transition-colors leading-snug">
                    {cert.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    {cert.category}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  {cert.date}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    onViewCertificate(cert);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 hover:border-sky-400 text-sky-300 hover:text-white font-mono text-xs tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>VIEW CREDENTIAL</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Prompt Banner */}
        {certifications.length > 4 && onViewAllCertificates && (
          <div className="p-5 rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-950/30 via-slate-900/40 to-indigo-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-semibold text-white">
                  Looking for more credentials & simulations?
                </p>
                <p className="text-[11px] font-mono text-slate-400">
                  {certifications.length} verified technical credentials and future certificates available in the vault.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onViewAllCertificates();
              }}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs tracking-wider transition-all cursor-pointer shrink-0 shadow-md shadow-sky-500/20"
            >
              EXPLORE FULL VAULT ({certifications.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
