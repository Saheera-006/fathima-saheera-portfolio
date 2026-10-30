import { motion } from 'motion/react';
import {
  Award,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileDown,
  Calendar,
  ZoomIn,
} from 'lucide-react';
import { CertificationItem } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { soundEngine } from '../utils/soundEffects';

interface CertificatesPageProps {
  onViewCertificate: (cert: CertificationItem) => void;
  onBackToHome: () => void;
  onResumeClick: () => void;
  onContactClick: () => void;
}

export function CertificatesPage({
  onViewCertificate,
  onBackToHome,
  onResumeClick,
  onContactClick,
}: CertificatesPageProps) {
  const { data } = usePortfolio();
  const certifications = data?.certifications || [];

  const issuers = new Set(
    certifications.map((cert) => cert.issuer).filter(Boolean)
  );

  const categories = new Set(
    certifications.map((cert) => cert.category).filter(Boolean)
  );

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f1f5f9] selection:bg-sky-500/30 selection:text-sky-200">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -left-40 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 right-1/3 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sky-500/15">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onBackToHome();
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-400 text-slate-200 hover:text-white font-mono text-xs tracking-wider transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-sky-400" />
              <span>BACK TO HOME</span>
            </button>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-slate-500">Home</span>
              <span>/</span>
              <span className="text-sky-300 font-semibold">
                Certificates Vault
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onResumeClick();
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-mono text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-sky-400" />
              <span>RESUME</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onContactClick();
              }}
              className="px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 hover:border-sky-400 text-sky-300 hover:text-white font-mono text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-sky-500/10"
            >
              CONTACT
            </button>
          </div>
        </div>

        {/* Hero Title and Metrics */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950/60 border border-sky-500/30 text-sky-400 font-mono text-xs shadow-lg shadow-sky-500/10">
            <Award className="w-3.5 h-3.5" />
            <span>
              OFFICIAL CREDENTIAL VAULT // CONTINUOUS LEARNING
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight">
                Verified Certifications &amp; Simulations
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Industry-backed training across software engineering, data
                analysis, Python fundamentals, and practical technical
                simulations. Explore my certifications and learning journey.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="p-3.5 rounded-2xl bg-[#090f20]/80 border border-sky-500/20">
                <div className="text-xl sm:text-2xl font-black font-mono text-sky-400">
                  {certifications.length}
                </div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Total Credentials
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#090f20]/80 border border-sky-500/20">
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                  {issuers.size}
                </div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Organizations
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#090f20]/80 border border-sky-500/20 col-span-2 sm:col-span-1">
                <div className="text-xl sm:text-2xl font-black font-mono text-cyan-400">
                  {categories.size}
                </div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Domains
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certificates Grid — No Search, Sort, or Filters */}
        {certifications.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-sky-500/20 bg-[#090f22]/60 space-y-4">
            <Award className="w-10 h-10 text-sky-400 mx-auto" />

            <h3 className="text-lg font-bold text-white">
              No certifications available yet
            </h3>

            <p className="text-sm text-slate-400">
              Certifications will appear here once they are added.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => {
              const hasCustomUrl =
                cert.certificateUrl &&
                !cert.certificateUrl.includes('wixsite.com');

              return (
                <motion.article
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.05, 0.3),
                  }}
                  className="group rounded-3xl border border-sky-500/20 bg-gradient-to-b from-[#090f20]/90 to-[#04070e]/95 p-5 sm:p-6 flex flex-col justify-between hover:border-sky-400/60 hover:shadow-[0_0_35px_rgba(56,189,248,0.15)] transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Issuer and Verification */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full bg-sky-950/70 border border-sky-500/30 text-xs font-mono text-sky-300 font-medium">
                        {cert.issuer}
                      </span>

                      <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </div>
                    </div>

                    {/* Certificate Preview */}
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        onViewCertificate(cert);
                      }}
                      aria-label={`Preview ${cert.title}`}
                      className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 group-hover:border-sky-500/40 transition-colors cursor-pointer flex items-center justify-center"
                    >
                      {cert.imageUrl ? (
                        <>
                          <img
                            src={cert.imageUrl}
                            alt={cert.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs">
                            <ZoomIn className="w-4 h-4 text-sky-400" />
                            <span>Preview Certificate</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4 text-center space-y-2 bg-gradient-to-b from-sky-950/30 to-slate-950 w-full h-full">
                          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                            <Award className="w-6 h-6" />
                          </div>

                          <span className="text-[11px] font-mono text-sky-300/80">
                            Verified Official Credential
                          </span>
                        </div>
                      )}
                    </button>

                    {/* Title and Category */}
                    <div className="space-y-2">
                      <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-sky-200 transition-colors leading-snug">
                        {cert.title}
                      </h2>

                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span className="text-sky-400/80 font-medium">
                          {cert.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Details and Actions */}
                  <div className="pt-4 border-t border-slate-800/80 mt-5 space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-600" />
                        <span>{cert.date || 'Completed'}</span>
                      </span>

                      <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Document Active</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          onViewCertificate(cert);
                        }}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 hover:border-sky-400 text-sky-300 hover:text-white font-mono text-xs tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5 text-sky-400" />
                        <span>VIEW CREDENTIAL</span>
                      </button>

                      {hasCustomUrl && (
                        <a
                          href={cert.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => soundEngine.playClick()}
                          aria-label={`Verify ${cert.title} externally`}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-sky-400 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Verify external digital credential"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Closing CTA */}
        <section className="p-8 rounded-3xl bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-slate-900/40 border border-sky-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-white">
              Continuous Professional Advancement
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              New certifications, virtual simulations, and technical
              achievements are continually added to this collection.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onResumeClick();
            }}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs tracking-wider transition-all shadow-lg shadow-sky-500/20 cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>DOWNLOAD RESUME</span>
          </button>
        </section>
      </main>
    </div>
  );
}

