import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Compass, X } from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';
import cuteHijabiHeadphones from '../assets/images/cute_hijabi_headphones_1790087241274.jpg';

interface RoamingHijabiCompanionProps {
  scrollProgress: number;
}

type RoamMode = 'roam' | 'follow' | 'perch';

interface ParticleTrail {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export function RoamingHijabiCompanion({ scrollProgress }: RoamingHijabiCompanionProps) {
  const [mode, setMode] = useState<RoamMode>('roam');
  const [pos, setPos] = useState({ x: 82, y: 72 }); // Viewport percentage
  const [velocity, setVelocity] = useState({ dx: 0, dy: 0 });
  const [dialogue, setDialogue] = useState('Floating through the digital space with you! ✨');
  const [showDialogue, setShowDialogue] = useState(true);
  const [isJumping, setIsJumping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [interactionPulse, setInteractionPulse] = useState(0);
  const [activePose, setActivePose] = useState<0 | 1>(0);
  const [trail, setTrail] = useState<ParticleTrail[]>([]);

  const targetPosRef = useRef({ x: 82, y: 72 });
  const lastPosRef = useRef({ x: 82, y: 72 });
  const dialogueTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dialogues = [
    'In the coding zone with my headphones on! 🎧💻',
    'Listening to chill beats while exploring with you! 🎧✨',
    'I love transforming ideas into real digital experiences! 🚀',
    'All certificates verified with authentic documentation! 📜✨',
    'From Figma prototypes to live deployment on web.app! 🌸',
    'Double-click anywhere on the screen and I’ll fly over! 💫',
    'Building with React, Flutter, Firebase & Gemini API! ⚡',
  ];

  // Natural roaming physics: gently wander between organic waypoints across page sections
  useEffect(() => {
    if (mode !== 'roam') return;

    const waypoints = [
      { x: 84, y: 68 }, // Bottom right
      { x: 88, y: 32 }, // Mid-upper right
      { x: 14, y: 62 }, // Mid-lower left
      { x: 16, y: 36 }, // Mid-upper left
      { x: 78, y: 82 }, // Lower right
      { x: 50, y: 86 }, // Bottom center
    ];

    let wpIndex = 0;
    const roamInterval = setInterval(() => {
      wpIndex = (wpIndex + 1) % waypoints.length;
      targetPosRef.current = waypoints[wpIndex];
      // Switch subtle pose as she glides
      setActivePose((prev) => (prev === 0 ? 1 : 0));
    }, 6500);

    return () => clearInterval(roamInterval);
  }, [mode]);

  // Smooth position interpolation towards target + velocity calculation for tilt & light trail
  useEffect(() => {
    let animId: number;
    let particleCounter = 0;

    const updateMotion = () => {
      setPos((current) => {
        const dx = targetPosRef.current.x - current.x;
        const dy = targetPosRef.current.y - current.y;
        
        const newX = current.x + dx * 0.04;
        const newY = current.y + dy * 0.04;

        setVelocity({ dx: (newX - lastPosRef.current.x) * 10, dy: (newY - lastPosRef.current.y) * 10 });
        lastPosRef.current = { x: newX, y: newY };

        // Generate glowing light trail particles when moving
        particleCounter++;
        if (particleCounter % 6 === 0 && (Math.abs(dx) > 0.2 || Math.abs(dy) > 0.2)) {
          setTrail((prev) => [
            ...prev.slice(-5),
            {
              id: Date.now() + Math.random(),
              x: newX + (Math.random() - 0.5) * 2,
              y: newY + (Math.random() - 0.5) * 2 + 3,
              size: Math.random() * 4 + 2,
              opacity: 0.8,
            },
          ]);
        }

        return { x: newX, y: newY };
      });

      // Slowly fade existing trail particles
      setTrail((prev) =>
        prev
          .map((p) => ({ ...p, opacity: p.opacity - 0.025 }))
          .filter((p) => p.opacity > 0.05)
      );

      animId = requestAnimationFrame(updateMotion);
    };

    animId = requestAnimationFrame(updateMotion);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Follow cursor mode handler
  useEffect(() => {
    if (mode !== 'follow') return;

    const handleMouseMove = (e: MouseEvent) => {
      const pctX = Math.max(8, Math.min(92, (e.clientX / window.innerWidth) * 100));
      const pctY = Math.max(10, Math.min(90, (e.clientY / window.innerHeight) * 100));
      targetPosRef.current = { x: pctX, y: pctY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mode]);

  // Double click anywhere to call her over!
  useEffect(() => {
    const handleDblClick = (e: MouseEvent) => {
      const pctX = Math.max(8, Math.min(92, (e.clientX / window.innerWidth) * 100));
      const pctY = Math.max(10, Math.min(90, (e.clientY / window.innerHeight) * 100));
      targetPosRef.current = { x: pctX, y: pctY };
      soundEngine.playChime(880);
      setInteractionPulse((prev) => prev + 1);
      triggerDialogue('Flying over to explore with you! 💫');
    };

    window.addEventListener('dblclick', handleDblClick);
    return () => window.removeEventListener('dblclick', handleDblClick);
  }, []);

  const triggerDialogue = (text?: string) => {
    const nextText = text || dialogues[Math.floor(Math.random() * dialogues.length)];
    setDialogue(nextText);
    setShowDialogue(true);

    if (dialogueTimeoutRef.current) clearTimeout(dialogueTimeoutRef.current);
    dialogueTimeoutRef.current = setTimeout(() => {
      setShowDialogue(false);
    }, 4500);
  };

  const handleCompanionClick = () => {
    soundEngine.playChime(740);
    setIsJumping(true);
    setInteractionPulse((prev) => prev + 1);
    setActivePose((prev) => (prev === 0 ? 1 : 0));
    triggerDialogue();
    setTimeout(() => setIsJumping(false), 600);
  };

  // Single canonical artwork: Cute hijabi developer with headphones
  const companionImage = cuteHijabiHeadphones;

  // Banking tilt calculation based on horizontal velocity (gliding feel)
  const tiltAngle = Math.max(-14, Math.min(14, velocity.dx * 1.8));

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsMinimized(false);
          soundEngine.playClick();
        }}
        className="fixed bottom-4 right-4 z-50 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-sky-400/40 text-xs font-mono text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.3)] backdrop-blur-md flex items-center gap-2 hover:bg-slate-900 transition-all hover:scale-105"
        title="Summon floating companion"
      >
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
        <span>👧 Summon Companion</span>
      </button>
    );
  }

  return (
    <>
      {/* 1. Cinematic Ethereal Trail Particles (Trailing her motion across the DOM) */}
      {trail.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none rounded-full z-40"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            backgroundColor: '#38bdf8',
            boxShadow: '0 0 10px #38bdf8, 0 0 18px #818cf8',
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.2s linear',
          }}
        />
      ))}

      {/* 2. Floating Cinematic Companion Entity (Strictly Zero Card / Frame) */}
      <motion.div
        id="roaming-hijabi-companion"
        className="fixed z-50 pointer-events-auto select-none"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          y: isJumping ? [-30, 0] : [0, -8, 0],
          rotate: isJumping ? [0, -8, 8, 0] : [tiltAngle, tiltAngle + 1, tiltAngle - 1, tiltAngle],
        }}
        transition={{
          y: isJumping ? { duration: 0.5, ease: 'easeOut' } : { repeat: Infinity, duration: 4.2, ease: 'easeInOut' },
          rotate: isJumping ? { duration: 0.5 } : { duration: 0.8, ease: 'easeOut' },
        }}
      >
        {/* Holographic Glowing Speech Pill */}
        <AnimatePresence>
          {showDialogue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 6 }}
              className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-sky-400/40 text-xs font-mono text-sky-200 shadow-[0_0_25px_rgba(56,189,248,0.35)] backdrop-blur-md whitespace-nowrap z-50 pointer-events-none flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>{dialogue}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient Environmental Light Field (Casts glowing light onto whichever section she passes) */}
        <div
          className="absolute -inset-16 sm:-inset-24 rounded-full pointer-events-none -z-10 transition-transform duration-500"
          style={{
            background: 'radial-gradient(circle, rgba(56,189,248,0.22) 0%, rgba(99,102,241,0.12) 42%, transparent 72%)',
            filter: 'blur(32px)',
          }}
        />

        {/* Environmental Interaction Pulse (Expands outward when clicked or summoned) */}
        {interactionPulse > 0 && (
          <motion.div
            key={interactionPulse}
            initial={{ scale: 0.6, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute -inset-4 rounded-full border border-sky-400/60 pointer-events-none -z-10 shadow-[0_0_20px_rgba(56,189,248,0.6)]"
          />
        )}

        {/* Floating Ground/Ambient Surface Reflection */}
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-28 sm:w-36 h-6 rounded-full pointer-events-none -z-10"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(56,189,248,0.25) 0%, rgba(56,189,248,0.05) 50%, transparent 80%)',
            filter: 'blur(8px)',
          }}
        />

        {/* Character Visual: Completely borderless, seamless feathered cutout */}
        <div
          onClick={handleCompanionClick}
          className="relative w-28 h-28 sm:w-36 sm:h-36 cursor-pointer group flex items-center justify-center transition-transform hover:scale-105"
          title="Fathima Saheera's roaming companion! Click to interact, double-click page to summon"
        >
          {/* Inner Silhouette Glow */}
          <div
            className="absolute inset-2 rounded-full pointer-events-none transition-all duration-300 group-hover:scale-110"
            style={{
              background: 'radial-gradient(circle, rgba(56,189,248,0.4) 0%, rgba(129,140,248,0.2) 60%, transparent 80%)',
              filter: 'blur(16px)',
            }}
          />

          {/* Feathered Character Image: Smooth Elliptical Transparency Falloff */}
          <div
            className="w-full h-full flex items-center justify-center select-none"
            style={{
              maskImage: 'radial-gradient(ellipse 46% 46% at 50% 48%, black 45%, rgba(0,0,0,0.8) 68%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 46% 46% at 50% 48%, black 45%, rgba(0,0,0,0.8) 68%, transparent 100%)',
            }}
          >
            <img
              src={companionImage}
              alt="Floating cinematic hijabi developer character"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top scale-110 group-hover:scale-115 transition-transform duration-500 mix-blend-screen"
              style={{
                filter: 'drop-shadow(0 0 16px rgba(56,189,248,0.45)) contrast(1.05) brightness(1.05)',
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* 3. Minimalist Floating Ambient HUD (Unobtrusive glass pill at bottom-right) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 border border-sky-500/25 shadow-[0_0_20px_rgba(0,0,0,0.6)] backdrop-blur-md text-[11px] font-mono text-slate-300">
        <span className="text-sky-300 flex items-center gap-1.5 font-medium">
          <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '9s' }} />
          <span className="hidden sm:inline">Companion:</span>
        </span>

        {/* Mode selector pills */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setMode('roam');
            triggerDialogue('Roam mode active! Exploring around 🌸');
          }}
          className={`px-2 py-0.5 rounded-full transition-all ${
            mode === 'roam'
              ? 'bg-sky-500/25 text-sky-200 border border-sky-400/50 font-bold shadow-[0_0_10px_rgba(56,189,248,0.25)]'
              : 'hover:text-white text-slate-400'
          }`}
          title="She roams freely around the page"
        >
          Roam
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setMode('follow');
            triggerDialogue('Following your cursor! 💫');
          }}
          className={`px-2 py-0.5 rounded-full transition-all ${
            mode === 'follow'
              ? 'bg-sky-500/25 text-sky-200 border border-sky-400/50 font-bold shadow-[0_0_10px_rgba(56,189,248,0.25)]'
              : 'hover:text-white text-slate-400'
          }`}
          title="She follows your mouse movement"
        >
          Follow
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setMode('perch');
            targetPosRef.current = { x: 88, y: 78 };
            triggerDialogue('Perched here observing! ☕');
          }}
          className={`px-2 py-0.5 rounded-full transition-all ${
            mode === 'perch'
              ? 'bg-sky-500/25 text-sky-200 border border-sky-400/50 font-bold shadow-[0_0_10px_rgba(56,189,248,0.25)]'
              : 'hover:text-white text-slate-400'
          }`}
          title="She perches quietly in the corner"
        >
          Perch
        </button>

        <button
          type="button"
          onClick={() => setIsMinimized(true)}
          className="ml-1 p-1 rounded-full text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
          title="Minimize avatar"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </>
  );
}
