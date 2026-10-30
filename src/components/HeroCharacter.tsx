import { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'motion/react';
import { Sparkles, Terminal, Code2, Layers, Cpu } from 'lucide-react';

interface HeroCharacterProps {
  mousePos: { x: number; y: number }; // normalized -1 to 1
}

export function HeroCharacter({ mousePos }: HeroCharacterProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const dialogueNotes = [
    '“Turning ideas into real digital experiences.”',
    '“Every symposium platform starts with a single conceptual spark.”',
    '“From Figma wireframes to full-stack production.”',
    '“Building with architectural discipline and clean interfaces.”'
  ];

  // Mouse physics for 3D card tilt & perspective parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);
  const holoOffsetFarX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const holoOffsetFarY = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);
  const holoOffsetNearX = useTransform(smoothX, [-0.5, 0.5], [26, -26]);
  const holoOffsetNearY = useTransform(smoothY, [-0.5, 0.5], [22, -22]);

  // Synchronize with global mouse position or local element hover
  useEffect(() => {
    x.set(mousePos.x * 0.7);
    y.set(mousePos.y * 0.7);
  }, [mousePos, x, y]);

  const handleNextDialogue = () => {
    setDialogueIndex((prev) => (prev + 1) % dialogueNotes.length);
  };

  return (
    <div
      ref={containerRef}
      id="hero-character-stage"
      className="relative w-full max-w-[440px] lg:max-w-[480px] aspect-[4/5] mx-auto select-none"
      style={{ perspective: 1200 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNextDialogue}
    >
      {/* Background ambient lighting halo behind character */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-600/20 via-sky-500/10 to-indigo-500/15 rounded-3xl blur-3xl -z-10 animate-pulse" />

      {/* Main 3D Card Frame */}
      <motion.div
        className="relative w-full h-full rounded-2xl md:rounded-3xl border border-sky-500/20 bg-[#080d1a]/80 backdrop-blur-md overflow-hidden shadow-2xl shadow-sky-950/40 p-3 sm:p-4 flex flex-col justify-end"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Deep Perspective Layer: Floating Background Grid & Code Nodes */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-40 -z-5"
          style={{
            x: holoOffsetFarX,
            y: holoOffsetFarY,
            transform: 'translateZ(-40px)',
          }}
        >
          <div className="absolute top-6 left-6 font-mono text-[11px] text-sky-400/40 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-sky-400/60" />
            <span>developer.observe()</span>
          </div>
          <div className="absolute top-16 right-6 font-mono text-[10px] text-indigo-300/30">
            {'<Idea.Design.Code />'}
          </div>
          <div className="absolute bottom-28 left-8 font-mono text-[10px] text-sky-300/30 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-sky-400/40" />
            <span>runtime: active</span>
          </div>
        </motion.div>

        {/* Character Image Element */}
        <div className="relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden flex items-center justify-center bg-radial from-slate-900 to-black">
          <img
            src="/src/assets/images/cute_hijabi_headphones_1790087241274.jpg"
            alt="Fathima Saheera 3D Developer Character with hijab and headphones"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-[1.03] transition-transform duration-700 ease-out"
          />

          {/* Cinematic lighting overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-sky-900/10 pointer-events-none" />

          {/* Interactive headphone cool-blue beacon */}
          <div className="absolute top-[28%] right-[26%] w-3 h-3 rounded-full bg-sky-400/80 shadow-[0_0_12px_#38bdf8] animate-ping pointer-events-none opacity-75" />
          <div className="absolute top-[28%] right-[26%] w-2 h-2 rounded-full bg-sky-300 pointer-events-none" />
        </div>

        {/* Foreground 3D Floating UI Panels with High Parallax (translateZ: 35px) */}
        <motion.div
          className="absolute top-6 right-6 z-20 pointer-events-none"
          style={{
            x: holoOffsetNearX,
            y: holoOffsetNearY,
            transform: 'translateZ(45px)',
          }}
        >
          <div className="px-3 py-1.5 rounded-full bg-[#0a1122]/90 border border-sky-400/30 text-[11px] font-mono text-sky-200 shadow-lg shadow-sky-950/60 backdrop-blur-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Full-Stack Synthesis</span>
          </div>
        </motion.div>

        {/* Floating Mini Architecture Chip */}
        <motion.div
          className="absolute bottom-24 -left-3 sm:-left-4 z-20 pointer-events-none hidden sm:block"
          style={{
            x: holoOffsetNearX,
            y: holoOffsetNearY,
            transform: 'translateZ(55px)',
          }}
        >
          <div className="p-3 rounded-xl bg-[#090f20]/95 border border-sky-500/30 text-xs text-slate-200 shadow-xl backdrop-blur-md max-w-[190px]">
            <div className="flex items-center gap-1.5 text-sky-400 font-mono text-[10px] mb-1">
              <Code2 className="w-3 h-3" />
              <span>DYNAMOZ & ARTIFY</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              Symposium systems brought to live production.
            </p>
          </div>
        </motion.div>

        {/* Bottom Interactive Dialogue Bubble */}
        <motion.div
          className="relative z-20 mt-[-48px] px-3.5 py-2.5 rounded-xl bg-[#090e1c]/95 border border-sky-500/30 backdrop-blur-md shadow-xl cursor-pointer hover:border-sky-400/50 transition-colors"
          style={{
            transform: 'translateZ(30px)',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-sky-400 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>Developer Insight</span>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">click to cycle</span>
          </div>
          <p className="text-xs text-slate-200 font-medium leading-relaxed italic">
            {dialogueNotes[dialogueIndex]}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
