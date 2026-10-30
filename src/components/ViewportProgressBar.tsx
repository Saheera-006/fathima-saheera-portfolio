import { useEffect, useState } from 'react';

interface ViewportProgressBarProps {
  scrollProgress: number; // 0 to 1
  activeSection?: string;
}

const SECTION_LABELS: Record<string, string> = {
  hero: 'Start',
  story: 'Journey',
  about: 'About',
  projects: 'Projects',
  experience: 'Experience',
  skills: 'Skills',
  certifications: 'Certifications',
  contact: 'Contact',
};

export function ViewportProgressBar({ scrollProgress, activeSection }: ViewportProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round(scrollProgress * 100)));
  const [showTooltip, setShowTooltip] = useState(false);

  // Briefly pulse tooltip on scroll milestone changes
  useEffect(() => {
    setShowTooltip(true);
    const timeout = setTimeout(() => setShowTooltip(false), 1800);
    return () => clearTimeout(timeout);
  }, [percentage]);

  const activeLabel = (activeSection && SECTION_LABELS[activeSection]) || `${percentage}%`;

  return (
    <div
      id="viewport-progress-container"
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-slate-950/60 backdrop-blur-xs pointer-events-none"
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Portfolio scroll progress"
    >
      {/* Animated gradient progress fill */}
      <div
        className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-400 transition-all duration-150 ease-out relative"
        style={{ width: `${percentage}%` }}
      >
        {/* Glow bead at leading edge */}
        {percentage > 0 && percentage < 100 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8,0_0_4px_#ffffff] -mr-1" />
        )}
      </div>

      {/* Floating subtle section badge at the top-right corner while scrolling */}
      <div
        className={`fixed top-4 right-4 sm:right-6 pointer-events-none transition-all duration-300 font-mono text-[11px] flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0a0f1d]/90 border border-sky-500/25 text-sky-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] ${
          showTooltip && percentage > 2 && percentage < 98 ? 'opacity-90 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        <span className="text-slate-400 font-medium">JOURNEY</span>
        <span className="text-sky-300 font-bold">{percentage}%</span>
        <span className="text-slate-500">·</span>
        <span className="text-slate-300 uppercase">{activeLabel}</span>
      </div>
    </div>
  );
}
