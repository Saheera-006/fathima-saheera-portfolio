import { Briefcase, Figma, Smartphone, Terminal, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';

export function ExperienceSection() {
  const { data } = usePortfolio();
  const experiences = data?.experience || PORTFOLIO_DATA.experience;

  return (
    <section
      id="experience"
      className="relative py-24 px-4 sm:px-6 lg:px-8 z-10"
    >
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/50 border border-sky-500/20 text-sky-400 font-mono text-xs">
            <Briefcase className="w-3.5 h-3.5" />
            <span>PRACTICAL EXPERIENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Experience & Internships
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl">
            Hands-on professional immersion applying interface design and application engineering workflows.
          </p>
        </div>

        {/* Experience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((exp, idx) => {
            const isFigma = exp.company.toLowerCase().includes('zoro');

            return (
              <div
                key={exp.company}
                className="relative rounded-2xl border border-sky-500/20 bg-gradient-to-b from-[#080d1a]/90 to-[#050811] backdrop-blur-md p-6 sm:p-7 shadow-xl hover:border-sky-400/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="p-3 rounded-xl bg-sky-950/50 border border-sky-500/30 text-sky-400 group-hover:scale-105 transition-transform">
                      {isFigma ? (
                        <Figma className="w-6 h-6 text-sky-400" />
                      ) : (
                        <Smartphone className="w-6 h-6 text-sky-400" />
                      )}
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
                      {exp.period}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-sky-200 transition-colors">
                      {exp.company}
                    </h3>
                    <p className="text-sm font-mono text-sky-400 font-medium mt-0.5">
                      {exp.role}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {exp.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800/80 mt-6 flex flex-wrap gap-1.5">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded bg-sky-950/40 border border-sky-500/20 text-sky-300 text-[10px] font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
