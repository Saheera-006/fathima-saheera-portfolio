import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Layout,
  Code2,
  Network,
  CheckCircle2,
  Rocket,
  Globe2,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Terminal,
  Database,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PORTFOLIO_DATA, StoryStage } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { soundEngine } from '../utils/soundEffects';

interface StoryJourneySectionProps {
  onStageChange?: (stageIndex: number) => void;
  onExploreProjects: () => void;
}

export function StoryJourneySection({ onStageChange, onExploreProjects }: StoryJourneySectionProps) {
  const { data } = usePortfolio();
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const stages = data?.storyStages || PORTFOLIO_DATA.storyStages;
  const currentStage = stages[currentStageIdx];

  // Auto-play story playback loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStageIdx((prev) => {
          const next = (prev + 1) % stages.length;
          soundEngine.playStageTransition(next);
          if (onStageChange) onStageChange(next);
          return next;
        });
      }, 4200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, stages.length, onStageChange]);

  const selectStage = (idx: number) => {
    setCurrentStageIdx(idx);
    soundEngine.playStageTransition(idx);
    if (onStageChange) onStageChange(idx);
  };

  const nextStage = () => {
    const next = Math.min(stages.length - 1, currentStageIdx + 1);
    selectStage(next);
  };

  const prevStage = () => {
    const prev = Math.max(0, currentStageIdx - 1);
    selectStage(prev);
  };

  const stageIcons = [
    Sparkles,     // IDEA
    Layout,       // DESIGN
    Code2,        // DEVELOP
    Network,      // CONNECT
    CheckCircle2, // TEST
    Rocket,       // DEPLOY
    Globe2        // LIVE
  ];

  return (
    <section
      id="story"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 z-10 flex flex-col justify-center"
    >
      <div className="max-w-7xl mx-auto w-full space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/50 border border-sky-500/20 text-sky-400 font-mono text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE DEVELOPER&apos;S ALCHEMY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How Ideas Become Digital Reality
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            A continuous pipeline where each stage triggers the next. Like crafting a fine product,
            raw human intent is distilled into living full-stack systems.
          </p>
        </div>

        {/* Interactive Story Timeline Scrubber */}
        <div className="w-full bg-[#080d1a]/80 backdrop-blur-md rounded-2xl border border-sky-500/20 p-3 sm:p-4 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Stage Indicators */}
            <div className="flex items-center justify-between w-full overflow-x-auto pb-2 md:pb-0 gap-1.5 sm:gap-2">
              {stages.map((stage, idx) => {
                const Icon = stageIcons[idx];
                const isActive = idx === currentStageIdx;
                const isCompleted = idx < currentStageIdx;

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => selectStage(idx)}
                    className={`group relative flex-1 min-w-[70px] sm:min-w-[90px] py-2 px-2 rounded-xl transition-all text-center flex flex-col items-center gap-1.5 focus:outline-none ${
                      isActive
                        ? 'bg-sky-500/20 border border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                        : isCompleted
                        ? 'bg-sky-950/30 border border-sky-500/10 text-slate-300 hover:border-sky-500/30'
                        : 'bg-slate-900/40 border border-slate-800/60 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                        isActive
                          ? 'bg-sky-400 text-slate-950 font-bold'
                          : isCompleted
                          ? 'bg-sky-900/50 text-sky-300'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs font-mono tracking-wider ${
                        isActive ? 'text-sky-300 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {stage.label}
                    </span>

                    {/* Active pip */}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping absolute -top-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={prevStage}
                disabled={currentStageIdx === 0}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous stage"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-2 rounded-lg bg-sky-500/15 border border-sky-400/30 text-sky-300 hover:bg-sky-500/25 transition-colors font-mono text-xs flex items-center gap-1.5"
                title={isPlaying ? 'Pause auto-transformation' : 'Play continuous transformation'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isPlaying ? 'PAUSE' : 'AUTO-PLAY'}</span>
              </button>
              <button
                type="button"
                onClick={nextStage}
                disabled={currentStageIdx === stages.length - 1}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next stage"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* The Continuous Cinematic Transformation Canvas Stage */}
        <div className="relative min-h-[540px] rounded-3xl border border-sky-500/20 bg-gradient-to-b from-[#080e1c]/90 via-[#060a14]/95 to-[#04070d] backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden">
          {/* Ambient stage glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-5" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-5" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage.id}
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -15 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Left Column: Stage Narrative & Architectural Milestone */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-sky-400 px-2.5 py-1 rounded-md bg-sky-950/60 border border-sky-400/30">
                    STAGE 0{currentStage.stageNumber} // 07
                  </span>
                  <span className="font-mono text-xs text-slate-400 tracking-wider">
                    {currentStage.milestone}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {currentStage.heading}
                  </h3>
                  <p className="text-lg font-mono text-sky-300/90 font-light">
                    {currentStage.tagline}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                  {currentStage.summary}
                </p>

                {/* Visual Metaphor Footnote */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="text-[10px] font-mono text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-sky-400" />
                    <span>Visual Transformation State</span>
                  </div>
                  <p className="text-slate-300 italic">{currentStage.visualMetaphor}</p>
                </div>

                {/* Progress Call to Action */}
                <div className="pt-2 flex items-center gap-4">
                  {currentStageIdx < stages.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextStage}
                      className="px-4 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 font-mono text-xs tracking-wider transition-colors flex items-center gap-2 group"
                    >
                      <span>ADVANCE TO {stages[currentStageIdx + 1].label}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onExploreProjects}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 text-slate-950 font-bold font-mono text-xs tracking-wider shadow-lg shadow-sky-400/25 hover:shadow-sky-400/40 transition-all flex items-center gap-2"
                    >
                      <span>SEE THE LIVE PROJECTS (DYNAMOZ & ARTIFY)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Dynamic Stage Transformation Simulator */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl bg-[#03060d]/90 border border-sky-500/25 p-5 shadow-2xl overflow-hidden min-h-[380px] flex flex-col justify-between">
                  {/* Top Bar: Terminal / Studio Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 font-mono text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 text-slate-300">pipeline://{currentStage.id}.env</span>
                    </div>
                    <span className="text-sky-400 text-[10px]">STATUS: OK</span>
                  </div>

                  {/* Stage-Specific Visual Simulator Canvas */}
                  <div className="my-4 flex-1 flex items-center justify-center relative min-h-[220px]">
                    {/* STAGE 1: IDEA */}
                    {currentStage.id === 'idea' && (
                      <div className="relative flex flex-col items-center justify-center text-center space-y-4">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full bg-sky-500/20 blur-xl animate-pulse" />
                          <div className="w-20 h-20 rounded-full border border-sky-400/50 bg-gradient-to-tr from-sky-500/30 to-indigo-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.4)]">
                            <Sparkles className="w-9 h-9 text-sky-300 animate-spin" style={{ animationDuration: '10s' }} />
                          </div>
                          {/* Orbiting Idea vectors */}
                          <div className="absolute -top-3 -left-4 px-2 py-1 rounded bg-sky-950/80 border border-sky-400/30 text-[10px] font-mono text-sky-200">
                            Problem: Event Queues
                          </div>
                          <div className="absolute -bottom-3 -right-4 px-2 py-1 rounded bg-sky-950/80 border border-sky-400/30 text-[10px] font-mono text-sky-200">
                            Vision: Unified Web
                          </div>
                        </div>
                        <p className="font-mono text-xs text-slate-300 max-w-xs">
                          Symposium registration bottlenecks mapped into an intuitive web architecture.
                        </p>
                      </div>
                    )}

                    {/* STAGE 2: DESIGN */}
                    {currentStage.id === 'design' && (
                      <div className="w-full space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="h-16 rounded-lg border border-dashed border-sky-400/40 bg-sky-950/20 p-2 flex flex-col justify-between">
                            <span className="text-[9px] font-mono text-sky-300">#Hero Header</span>
                            <div className="w-3/4 h-2 rounded bg-sky-400/30" />
                          </div>
                          <div className="h-16 rounded-lg border border-dashed border-sky-400/40 bg-sky-950/20 p-2 flex flex-col justify-between">
                            <span className="text-[9px] font-mono text-sky-300">#Schedule Matrix</span>
                            <div className="w-1/2 h-2 rounded bg-sky-400/30" />
                          </div>
                          <div className="h-16 rounded-lg border border-dashed border-sky-400/40 bg-sky-950/20 p-2 flex flex-col justify-between">
                            <span className="text-[9px] font-mono text-sky-300">#Registration Gate</span>
                            <div className="w-4/5 h-2 rounded bg-sky-400/30" />
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
                          <span>Figma Wireframe Grid</span>
                          <span className="text-sky-400">8pt Rhythm • WCAG AA Contrast</span>
                        </div>
                      </div>
                    )}

                    {/* STAGE 3: DEVELOP */}
                    {currentStage.id === 'develop' && (
                      <div className="w-full space-y-2">
                        <div className="p-3 rounded-xl bg-slate-950 border border-sky-500/20 font-mono text-xs text-slate-300 space-y-1">
                          <div className="text-sky-400">{'<EventRegistrationGate>'}</div>
                          <div className="pl-4 text-slate-400">{'<TrackSelector options={symposiumTracks} />'}</div>
                          <div className="pl-4 text-emerald-400">{'<TeamRosterValidator />'}</div>
                          <div className="text-sky-400">{'</EventRegistrationGate>'}</div>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                          <span className="w-2 h-2 rounded-full bg-sky-400" />
                          <span>Component tree initialized • Responsive state active</span>
                        </div>
                      </div>
                    )}

                    {/* STAGE 4: CONNECT */}
                    {currentStage.id === 'connect' && (
                      <div className="w-full flex items-center justify-between gap-3 font-mono text-xs">
                        <div className="flex-1 p-3 rounded-xl bg-sky-950/30 border border-sky-500/30 text-center">
                          <Layers className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                          <span className="text-sky-200 font-semibold block text-[11px]">Client UI</span>
                          <span className="text-slate-400 text-[10px]">React Views</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] text-sky-300 animate-pulse">REST API</span>
                          <div className="w-14 h-0.5 bg-gradient-to-r from-sky-400 to-indigo-400 relative">
                            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white] animate-ping" />
                          </div>
                          <span className="text-[9px] text-slate-500">JSON Payload</span>
                        </div>

                        <div className="flex-1 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-center">
                          <Database className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                          <span className="text-indigo-200 font-semibold block text-[11px]">Database</span>
                          <span className="text-slate-400 text-[10px]">Relational SQL</span>
                        </div>
                      </div>
                    )}

                    {/* STAGE 5: TEST */}
                    {currentStage.id === 'test' && (
                      <div className="w-full space-y-2 font-mono text-xs">
                        {[
                          { test: 'Symposium Registration Form Sanitization', status: 'PASSED' },
                          { test: 'Concurrent Submission Rate Limit', status: 'PASSED' },
                          { test: 'AI Rubric Score Calculation Check', status: 'PASSED' },
                          { test: 'Cross-browser Mobile Ergonomics', status: 'PASSED' },
                        ].map((t) => (
                          <div
                            key={t.test}
                            className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between text-slate-200"
                          >
                            <span className="text-[11px] truncate">{t.test}</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                              {t.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* STAGE 6: DEPLOY */}
                    {currentStage.id === 'deploy' && (
                      <div className="w-full space-y-3 font-mono text-xs text-center">
                        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                          <Rocket className="w-10 h-10 text-sky-400 -rotate-45 animate-bounce" />
                          <div className="absolute inset-0 rounded-full border border-sky-400/40 animate-ping" />
                        </div>
                        <div className="text-slate-300">
                          <span className="text-sky-300 font-bold">Bundle Complete:</span> 0 errors •
                          Optimized production build
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Edge DNS propagated globally via Cloud CDN
                        </div>
                      </div>
                    )}

                    {/* STAGE 7: LIVE */}
                    {currentStage.id === 'live' && (
                      <div className="w-full text-center space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-400/40 text-emerald-300 font-mono text-xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>PRODUCTION READY & ACTIVE</span>
                        </div>
                        <h4 className="text-xl font-bold text-white">
                          Real Symposiums. Real Users.
                        </h4>
                        <p className="text-xs text-slate-300 font-sans max-w-sm mx-auto">
                          The conceptual spark is now a live, tangible piece of software serving participants and judges.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bottom Code Snippet Display */}
                  <div className="pt-3 border-t border-slate-800/80">
                    <pre className="font-mono text-[11px] text-sky-300/80 leading-relaxed overflow-x-auto p-2.5 rounded-lg bg-black/60 border border-slate-800">
                      <code>{currentStage.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
