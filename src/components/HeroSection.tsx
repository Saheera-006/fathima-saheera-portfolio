
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ArrowDown, Terminal, Code, FileDown } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';

interface HeroSectionProps {
  mousePos: { x: number; y: number };
  onBeginJourney: () => void;
  onExploreWork: () => void;
  onResumeClick: () => void;
}

export function HeroSection({
  mousePos,
  onBeginJourney,
  onExploreWork,
  onResumeClick,
}: HeroSectionProps) {
  const { data } = usePortfolio();
  const profile = data?.profile || PORTFOLIO_DATA.profile;

  // Typing Animation
  const phrases = [
    'Building Ideas Into Applications',
    'Aspiring Full Stack Developer',
    'Learning | Building | Improving',
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];

    let delay = isDeleting ? 45 : 90;

    if (!isDeleting && typedText === currentPhrase) {
      delay = 1800;
    } else if (isDeleting && typedText === '') {
      delay = 400;
    }

    const timer = window.setTimeout(() => {
      if (!isDeleting && typedText === currentPhrase) {
        setIsDeleting(true);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      } else if (isDeleting) {
        setTypedText(currentPhrase.slice(0, typedText.length - 1));
      } else {
        setTypedText(currentPhrase.slice(0, typedText.length + 1));
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [typedText, isDeleting, phraseIndex]);

  return (
    <section
      id="hero"
      className="hero-section relative min-h-[95vh] md:min-h-screen flex items-center justify-start py-24 px-4 sm:px-6 lg:px-8 overflow-hidden z-10"
    >
      <div className="hero-content w-full max-w-7xl mx-auto grid grid-cols-1 gap-8 items-start justify-items-start">

        {/* Left Column: Identity */}
        <div className="hero-copy w-full max-w-4xl ml-0 flex flex-col justify-center items-start text-left space-y-6">

          {/* Status Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-sky-950/40 border border-sky-500/20 text-sky-300 w-fit backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
            </span>

            <span className="font-mono text-xs tracking-wider">
              CSE 2023–2027 • University College of Engineering
            </span>
          </motion.div>

          {/* Primary Name Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-3"
          >
            {/* Intro Text */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="block text-sm sm:text-base font-mono tracking-[0.3em] text-sky-400 uppercase mb-3"
            >
              HI, I'M
            </motion.span>

            <h1
              id="hero-name-title"
              className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white font-sans uppercase"
            >
              <span className="block text-slate-100">
                FATHIMA
              </span>

              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-indigo-300">
                SAHEERA
              </span>
            </h1>

            {/* Typing Animation */}
            <div
              id="hero-role-title"
              className="pt-1 min-h-[36px] sm:min-h-[42px] flex items-center"
            >
              <span className="text-lg sm:text-xl md:text-2xl font-mono font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-200">
                {typedText}
                <span className="inline-block w-[2px] h-[1em] bg-sky-400 ml-1 align-middle animate-pulse" />
              </span>
            </div>
          </motion.div>

          {/* Welcome Paragraph - Sharp Cinematic Box */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.3,
              ease: 'easeOut',
            }}
            className="relative w-full max-w-2xl"
          >
            <div className="relative bg-gradient-to-r from-[#080e1b]/95 via-[#080e1b]/65 to-transparent px-5 py-5 sm:px-7 sm:py-6">

              {/* Left Accent Line */}
              <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-sky-950 via-sky-500/70 to-transparent" />

              <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed font-sans">
                Welcome to the digital atelier where conceptual sparks transform into living, deployed applications. Step through the continuous engineering journey from raw idea to live production web platforms.
              </p>
            </div>
          </motion.div>

          {/* Story Pipeline Ribbon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="pt-2"
          >
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>THE ARCHITECTURAL LIFECYCLE</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-mono">
              {['IDEA', 'DESIGN', 'DEVELOP', 'CONNECT', 'TEST', 'DEPLOY', 'LIVE'].map(
                (stage, idx) => (
                  <div key={stage} className="flex items-center gap-1.5 sm:gap-2">
                    <span className="px-2 py-1 rounded bg-[#0b1324] border border-sky-500/20 text-sky-300 text-[11px]">
                      {stage}
                    </span>

                    {idx < 6 && (
                      <span className="text-slate-600 text-xs">→</span>
                    )}
                  </div>
                )
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="pt-4 flex flex-wrap items-center gap-4"
          >
            <button
              type="button"
              id="hero-begin-story-btn"
              onClick={onBeginJourney}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 font-semibold font-mono text-xs tracking-wider shadow-lg shadow-sky-500/25 hover:shadow-sky-400/40 transition-all duration-300 flex items-center gap-2 group focus:outline-none"
            >
              <span>EXPERIENCE THE TRANSFORMATION</span>
              <ArrowDown className="w-4 h-4 text-slate-950 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              type="button"
              id="hero-explore-work-btn"
              onClick={onExploreWork}
              className="px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 hover:border-sky-400/40 text-slate-200 hover:text-white font-mono text-xs tracking-wider transition-all duration-200 flex items-center gap-2"
            >
              <Code className="w-4 h-4 text-sky-400" />
              <span>EXPLORE PROJECTS</span>
            </button>

            <button
              type="button"
              id="hero-resume-btn"
              onClick={onResumeClick}
              className="px-4 py-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-sky-500/25 hover:border-sky-400/60 text-sky-300 hover:text-white font-mono text-xs tracking-wider transition-all duration-200 flex items-center gap-2"
              title="View & Download Official Resume"
            >
              <FileDown className="w-4 h-4 text-sky-400" />
              <span>RESUME</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">
          Scroll to transform
        </span>

        <div className="w-4 h-7 rounded-full border border-sky-400/30 flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-1.5 rounded-full bg-sky-400"
            animate={{ y: [0, 10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>
    </section>
  );
}
