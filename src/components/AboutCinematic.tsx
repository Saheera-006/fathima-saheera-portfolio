import { motion } from 'motion/react';
import { GraduationCap, MapPin, Calendar, Code, Sparkles, Terminal, FileDown } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';

interface AboutCinematicProps {
  onResumeClick?: () => void;
}

export function AboutCinematic({ onResumeClick }: AboutCinematicProps) {
  const { data } = usePortfolio();
  const profile = data?.profile || PORTFOLIO_DATA.profile;
  const { education, approach, permanentMessage } = profile;

  return (
    <section
      id="about"
      className="relative py-24 px-4 sm:px-6 lg:px-8 z-10"
    >
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-3xl border border-sky-500/20 bg-gradient-to-b from-[#090f20]/80 via-[#070b16]/90 to-[#05070f] backdrop-blur-xl p-8 sm:p-12 shadow-2xl overflow-hidden">
          {/* Subtle background ambient ray */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: About Text & Academic Credentials */}
            <div className="md:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/50 border border-sky-500/20 text-sky-400 font-mono text-xs">
                <Terminal className="w-3.5 h-3.5" />
                <span>ABOUT THE DEVELOPER</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Fathima Saheera J
                </h2>
                <p className="text-lg font-mono text-sky-300">
                  {education.status}
                </p>
              </div>

              {/* Education cards follow the order saved in Admin CMS. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(profile.educationItems?.length ? profile.educationItems : [{ id: 'education-main', institution: education.institution, degree: education.degree, years: education.years, status: education.status, statement: education.statement }]).map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-black/40 border border-slate-800/80 space-y-2">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-sky-500/15 text-sky-400 border border-sky-400/20 shrink-0 mt-0.5">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100 leading-tight">{item.institution}</h4>
                        <p className="text-[11px] font-mono text-sky-300/90 mt-0.5">{item.degree}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-slate-400">
                          {item.years && <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-sky-400" />{item.years}</span>}
                          {item.institution.toLowerCase().includes('university') && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-sky-400" />Nagercoil, TN</span>}
                        </div>
                        {item.statement && <p className="text-xs text-slate-300 mt-2 leading-relaxed">{item.statement}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Exact user-provided summary from resume */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans font-light">
                “{education.statement}”
              </p>

              {/* Languages & Core Strengths */}
              <div className="pt-1 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-sky-300">
                  Tamil (Native)
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-sky-300">
                  English (Professional Working)
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                  React-Firebase Web Apps
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                  Flutter Mobile Apps
                </span>
              </div>
            </div>

            {/* Right: Architectural Philosophy Badge */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-sky-950/20 border border-sky-500/20 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                <Sparkles className="w-8 h-8 text-sky-300" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono text-sky-400 uppercase tracking-wider block">
                  Core Conviction
                </span>
                <p className="text-sm font-medium text-slate-200 leading-snug">
                  {permanentMessage}
                </p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Grounded in core CS concepts and modern web craft to build digital systems that matter.
              </p>

              {onResumeClick && (
                <button
                  type="button"
                  id="about-download-resume-btn"
                  onClick={onResumeClick}
                  className="w-full py-2.5 px-3 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 hover:border-sky-400/60 text-sky-200 hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <FileDown className="w-3.5 h-3.5 text-sky-400" />
                  <span>VIEW / SAVE RESUME</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
