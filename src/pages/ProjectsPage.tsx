import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowLeft,
  Layers,
  Globe,
  ExternalLink,
  ArrowUpRight,
  Check,
  Code2,
  FileDown,
  MessageSquare,
} from 'lucide-react';
import { ProjectData } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { soundEngine } from '../utils/soundEffects';

interface ProjectsPageProps {
  onSelectProject: (project: ProjectData) => void;
  onLiveUrlClick: (project: ProjectData) => void;
  onBackToHome: () => void;
  onResumeClick: () => void;
  onContactClick: () => void;
}

export function ProjectsPage({
  onSelectProject,
  onLiveUrlClick,
  onBackToHome,
  onResumeClick,
  onContactClick,
}: ProjectsPageProps) {
  const { data } = usePortfolio();
  const projects = data?.projects || [];

  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.tags))
  );

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#f1f5f9] selection:bg-sky-500/30 selection:text-sky-200">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-none w-full mx-0 px-4 sm:px-8 lg:px-12 py-8 sm:py-12 space-y-12">
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
                Projects Archive
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
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
              <span>LET'S CONNECT</span>
            </button>
          </div>
        </div>

        {/* Page Heading & Statistics */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950/60 border border-sky-500/30 text-sky-400 font-mono text-xs shadow-lg shadow-sky-500/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>MY WORK // BUILT WITH PURPOSE</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight">
                All Projects &amp; Platforms
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                A collection of ideas I have brought to life through code,
                experimentation, and problem-solving. Explore the projects,
                the technologies behind them, and what each one can do.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="p-3.5 rounded-2xl bg-[#090f20]/80 border border-sky-500/20 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black font-mono text-sky-400">
                  {projects.length}
                </div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Total Projects
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#090f20]/80 border border-sky-500/20 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                  100%
                </div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Live Production
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#090f20]/80 border border-sky-500/20 backdrop-blur-sm col-span-2 sm:col-span-1">
                <div className="text-xl sm:text-2xl font-black font-mono text-indigo-400">
                  {allTags.length}+
                </div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Technologies
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid — No Search or Stack Filters */}
        <section aria-label="All projects">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group relative rounded-2xl border border-sky-500/25 bg-gradient-to-b from-[#090f20]/95 via-[#070b16]/95 to-[#04070d] backdrop-blur-xl p-4 sm:p-5 shadow-xl flex flex-col justify-between w-full hover:border-sky-400/80 hover:-translate-y-1 hover:shadow-[0_0_28px_rgba(56,189,248,0.14)] transition-all duration-300"
              >
                <div className="space-y-5">
                  {/* Browser Preview */}
                  <div className="relative rounded-2xl border border-sky-500/30 bg-black/90 overflow-hidden shadow-xl group-hover:border-sky-400/60 transition-colors">
                    <div className="px-3.5 py-2.5 bg-[#0a101f] border-b border-slate-800 flex items-center justify-between gap-2 font-mono text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shrink-0" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shrink-0" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shrink-0" />
                        <span className="ml-2 text-slate-300 text-[11px] truncate max-w-[200px]">
                          {project.liveUrl && project.liveUrl !== '#'
                            ? project.liveUrl.replace(/^https?:\/\//, '')
                            : project.title}
                        </span>
                      </div>

                      <span className="text-[10px] text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30 font-medium shrink-0">
                        PROJECT
                      </span>
                    </div>

                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950/90 p-2 sm:p-3">
                      <img
                        src={project.image}
                        alt={`${project.title} preview`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain object-center rounded-md border border-slate-700/80 bg-[#050811]"
                      />

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full bg-[#080d1a]/90 backdrop-blur-md border border-sky-400/40 text-sky-200 text-[11px] font-mono shadow-md">
                          {project.role}
                        </span>

                        {project.images && project.images.length > 0 && (
                          <span className="px-2.5 py-1 rounded-full bg-sky-950/90 backdrop-blur-md border border-sky-500/40 text-sky-300 text-[10px] font-mono flex items-center gap-1 shadow-md">
                            <span>📸</span>
                            <span>{1 + project.images.length} Photos</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Project Title */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-sky-400">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>
                          PROJECT {String(index + 1).padStart(2, '0')}
                        </span>
                      </span>

                      {project.subtitle && (
                        <span className="px-2 py-1 rounded bg-sky-950/70 border border-sky-500/25 text-[10px] text-sky-300 uppercase tracking-widest">
                          {project.subtitle}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {project.title}
                    </h2>

                    {project.tagline && (
                      <p className="text-xs sm:text-sm font-mono text-sky-300 font-light">
                        {project.tagline}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed font-sans line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technology Tags */}
                  {project.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md bg-[#0a1224] border border-sky-500/20 text-sky-300 text-[10px] sm:text-xs font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}



                </div>

                {/* Project Actions */}
                <div className="pt-6 border-t border-slate-800/80 mt-6 flex flex-col sm:flex-row items-stretch gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      onSelectProject(project);
                    }}
                    className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs tracking-wider shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
                  >
                    <span>EXPLORE ARCHITECTURE</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </button>

                  {project.liveUrl && project.liveUrl !== '#' ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEngine.playClick()}
                      className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-sky-500/30 hover:border-sky-400 text-sky-200 hover:text-white font-mono text-xs tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      <Globe className="w-3.5 h-3.5 text-sky-400" />
                      <span>VISIT LIVE</span>
                      <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        onLiveUrlClick(project);
                      }}
                      className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-sky-500/30 hover:border-sky-400 text-sky-200 hover:text-white font-mono text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-sky-400" />
                      <span>VISIT LIVE</span>
                    </button>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Contact Banner */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-slate-900/40 border border-sky-500/20 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Have an Idea for a New Application?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Have a project in mind? Let's talk about how we can bring it to
              life.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onContactClick();
            }}
            className="shrink-0 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs tracking-wider transition-all shadow-lg shadow-sky-500/20 cursor-pointer hover:scale-105 active:scale-95"
          >
            START A CONVERSATION
          </button>
        </section>
      </div>
    </div>
  );
}
