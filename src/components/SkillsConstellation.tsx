import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code,
  Terminal,
  Cpu,
  FileCode,
  Palette,
  Sparkles,
  Database,
  GitBranch,
  Layout,
  Binary,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PORTFOLIO_DATA, SkillItem } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { soundEngine } from '../utils/soundEffects';

export function SkillsConstellation() {
  const { data } = usePortfolio();
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(null);

  const skills = data?.skills || PORTFOLIO_DATA.skills;

  const filteredSkills = skills;

  const getIcon = (name: string) => {
    switch (name) {
      case 'C':
        return Terminal;
      case 'Python':
        return Code;
      case 'Java':
        return Cpu;
      case 'HTML':
        return FileCode;
      case 'CSS':
        return Palette;
      case 'JavaScript':
        return Sparkles;
      case 'SQL':
        return Database;
      case 'Git':
        return GitBranch;
      case 'Figma':
        return Layout;
      default:
        return Binary;
    }
  };

  return (
    <section
      id="skills"
      className="relative py-24 px-4 sm:px-6 lg:px-8 z-10"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/50 border border-sky-500/20 text-sky-400 font-mono text-xs">
            <Layers className="w-3.5 h-3.5" />
            <span>TECHNICAL CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Skills & Core Foundations
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl">
            A cohesive toolkit spanning systems programming, semantic web design, database architectures,
            and fundamental algorithmic problem solving.
          </p>
        </div>

        {/* Visual Constellation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <AnimatePresence>
            {filteredSkills.map((skill) => {
              const Icon = getIcon(skill.name);
              const isSelected = activeSkill?.name === skill.name;

              return (
                <motion.div
                  key={skill.name}
                  layout
                  initial={{ scale: 0.96 }}
                  animate={{ scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveSkill(isSelected ? null : skill);
                  }}
                  className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[140px] group ${
                    isSelected
                      ? 'bg-sky-950/40 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                      : 'bg-[#080d19]/80 border-sky-500/15 hover:border-sky-500/40 hover:bg-[#0a1224]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-sky-400 text-slate-950'
                          : 'bg-sky-950/60 text-sky-400 border border-sky-500/20 group-hover:border-sky-400/40'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-1 mt-3">
                    <h3 className="text-base font-bold text-white group-hover:text-sky-200 transition-colors">
                      {skill.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight font-sans">
                      {skill.description}
                    </p>
                  </div>

                  {/* Corner Accent */}
                  <div
                    className={`absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full transition-colors ${
                      isSelected ? 'bg-sky-400' : 'bg-slate-700 group-hover:bg-sky-500/40'
                    }`}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Selected Skill Deep Dive Callout */}
        {activeSkill && (
          <motion.div
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            className="p-5 rounded-2xl bg-sky-950/30 border border-sky-400/30 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block">
                SKILL DETAILS
              </span>
              <h4 className="text-lg font-bold text-white">
                {activeSkill.name}
              </h4>
              <p className="text-xs text-slate-300 max-w-xl">
                {activeSkill.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveSkill(null)}
              className="text-xs font-mono text-slate-400 hover:text-sky-300 underline underline-offset-4"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
