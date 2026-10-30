import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';
import cuteHijabiHeadphones from '../assets/images/cute_hijabi_headphones_1790087241274.jpg';

interface HeroPlayingSceneProps {
  mousePos: { x: number; y: number }; // normalized -1 to 1
}

interface FloatingOrb {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  label: string;
  vx: number;
  vy: number;
  pulsePhase: number;
}

interface CharacterEmotionSpark {
  id: number;
  x: number;
  y: number;
  emoji: string;
  scale: number;
}

export function HeroPlayingScene({ mousePos }: HeroPlayingSceneProps) {
  const [playScore, setPlayScore] = useState(14);
  const [reactionText, setReactionText] = useState('Listening to code vibes 🎧');
  const [emotionSparks, setEmotionSparks] = useState<CharacterEmotionSpark[]>([]);
  const lastMousePosRef = useRef({ x: mousePos.x, y: mousePos.y });
  const mouseMoveTimerRef = useRef<number | null>(null);

  // Single canonical artwork: Cute hijabi developer wearing headphones in her dark workstation
  const heroImage = cuteHijabiHeadphones;

  // Interactive Floating Code Orbs
  const [orbs, setOrbs] = useState<FloatingOrb[]>([
    { id: 1, x: 22, y: 35, size: 28, color: '#38bdf8', label: '<Code />', vx: 0.2, vy: 0.15, pulsePhase: 0 },
    { id: 2, x: 74, y: 28, size: 34, color: '#818cf8', label: '{Idea}', vx: -0.18, vy: 0.2, pulsePhase: 1 },
    { id: 3, x: 70, y: 68, size: 30, color: '#34d399', label: '✨ Spark', vx: -0.15, vy: -0.18, pulsePhase: 2 },
    { id: 4, x: 18, y: 64, size: 24, color: '#f472b6', label: 'λ Pure', vx: 0.22, vy: -0.12, pulsePhase: 3 },
    { id: 5, x: 50, y: 18, size: 26, color: '#38bdf8', label: '01 Logic', vx: 0.1, vy: 0.25, pulsePhase: 4 },
  ]);

  // Subtle Mouse Moving Emotions: Listen to mouse movement and trigger gentle micro-reactions
  useEffect(() => {
    const dx = mousePos.x - lastMousePosRef.current.x;
    const dy = mousePos.y - lastMousePosRef.current.y;
    const speed = Math.hypot(dx, dy);

    if (speed > 0.04) {
      // Clear idle timer
      if (mouseMoveTimerRef.current) clearTimeout(mouseMoveTimerRef.current);

      // Micro-emotions based on mouse position
      const isNearCharacter = mousePos.x > 0.1 && mousePos.y > -0.4 && mousePos.y < 0.6;
      if (isNearCharacter) {
        setReactionText('Warm welcoming smile 😊✨');
      } else if (speed > 0.15) {
        setReactionText('Sparks connecting! 💫');
      } else {
        setReactionText('Noticing your cursor! 🌸');
      }

      // Occasionally emit a subtle emotion spark near character when mouse moves actively
      if (Math.random() > 0.72) {
        const id = Date.now() + Math.random();
        const emotions = ['✨', '🌸', '💫', '💡', '♡', '{</>}'];
        const spark: CharacterEmotionSpark = {
          id,
          x: 40 + (Math.random() - 0.5) * 40,
          y: 35 + (Math.random() - 0.5) * 40,
          emoji: emotions[Math.floor(Math.random() * emotions.length)],
          scale: Math.random() * 0.4 + 0.8,
        };

        setEmotionSparks((prev) => [...prev.slice(-5), spark]);

        setTimeout(() => {
          setEmotionSparks((prev) => prev.filter((s) => s.id !== id));
        }, 1400);
      }

      // Return to calm flow state after movement stops
      mouseMoveTimerRef.current = window.setTimeout(() => {
        setReactionText('In the developer flow state 🎧');
      }, 2200);
    }

    lastMousePosRef.current = { x: mousePos.x, y: mousePos.y };
  }, [mousePos]);

  // Orb float animation loop with gentle mouse gravitation
  useEffect(() => {
    let animId: number;
    let t = 0;
    const updateOrbs = () => {
      t += 0.02;
      setOrbs((prevOrbs) =>
        prevOrbs.map((orb) => {
          let newX = orb.x + Math.sin(t + orb.pulsePhase) * 0.15 + orb.vx;
          let newY = orb.y + Math.cos(t + orb.pulsePhase) * 0.15 + orb.vy;

          // Soft boundary bounce
          if (newX < 10 || newX > 88) orb.vx *= -1;
          if (newY < 15 || newY > 80) orb.vy *= -1;

          return {
            ...orb,
            x: Math.max(8, Math.min(90, newX)),
            y: Math.max(12, Math.min(82, newY)),
          };
        })
      );
      animId = requestAnimationFrame(updateOrbs);
    };
    animId = requestAnimationFrame(updateOrbs);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleOrbClick = (e: React.MouseEvent, orb: FloatingOrb) => {
    e.stopPropagation();
    soundEngine.playChime(659.25 + orb.id * 80);
    setPlayScore((prev) => prev + 1);

    const id = Date.now();
    setEmotionSparks((prev) => [
      ...prev,
      { id, x: orb.x, y: orb.y, emoji: '✨', scale: 1.2 },
    ]);
    setTimeout(() => {
      setEmotionSparks((prev) => prev.filter((s) => s.id !== id));
    }, 1200);

    const reactions = [
      `Caught the ${orb.label} orb! ✨`,
      'Sparks connected!',
      'Playful logic in motion!',
      'Ideas taking visual form!',
      'Giggle & code magic! 💫',
    ];
    setReactionText(reactions[Math.floor(Math.random() * reactions.length)]);
  };

  const handleGirlClick = () => {
    soundEngine.playChime(784);
    setPlayScore((prev) => prev + 2);
    setReactionText('“Let’s build something wonderful!” 💖');

    const id = Date.now();
    setEmotionSparks((prev) => [
      ...prev,
      { id, x: 50, y: 40, emoji: '💖', scale: 1.4 },
    ]);
    setTimeout(() => {
      setEmotionSparks((prev) => prev.filter((s) => s.id !== id));
    }, 1200);
  };

  return (
    <div
      id="hero-playing-scene"
      className="relative w-full max-w-[480px] h-[460px] mx-auto select-none flex items-center justify-center pointer-events-auto"
    >
      {/* 1. Deep Atmospheric Light & Ambient Halo (Zero rectangular edges) */}
      <div className="absolute inset-0 bg-radial from-sky-500/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* 2. Main Cute Character Scene - Free-floating & 100% Seamlessly Blended with Background */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        onClick={handleGirlClick}
        animate={{
          y: [0, -8, 0],
          rotateX: -mousePos.y * 8,
          rotateY: mousePos.x * 12,
        }}
        transition={{
          y: { repeat: Infinity, duration: 5, ease: 'easeInOut' },
          rotateX: { duration: 0.3, ease: 'easeOut' },
          rotateY: { duration: 0.3, ease: 'easeOut' },
        }}
        style={{ perspective: 1000 }}
      >
        {/* Seamless Image Container with soft radial feathering, zero box boundaries */}
        <div
          className="relative w-full h-full flex items-center justify-center overflow-visible"
          style={{
            maskImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.85) 58%, rgba(0,0,0,0) 74%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.85) 58%, rgba(0,0,0,0) 74%)',
          }}
        >
          {/* Single Canon Image: cute_hijabi_headphones_1790087241274 */}
          <motion.img
            src={heroImage}
            alt="Cute girl developer with hijab and headphones smiling and coding"
            referrerPolicy="no-referrer"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="w-full h-full object-contain object-center mix-blend-screen"
          />

          {/* Cyan Headphone Neon Ring Pulse (matches the sci-fi headset in video) */}
          <motion.div
            className="absolute top-[28%] right-[27%] w-3.5 h-3.5 rounded-full border border-sky-400/80 shadow-[0_0_12px_#38bdf8] pointer-events-none"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: 'easeInOut',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-sky-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </motion.div>
        </div>

        {/* Floating Emotion Sparks When Mouse Moves Around Her */}
        <AnimatePresence>
          {emotionSparks.map((spark) => (
            <motion.div
              key={spark.id}
              initial={{ opacity: 0, scale: 0.4, y: 0 }}
              animate={{ opacity: 0.9, scale: spark.scale, y: -25 }}
              exit={{ opacity: 0, scale: 1.2, y: -45 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute z-50 pointer-events-none text-base filter drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"
              style={{
                left: `${spark.x}%`,
                top: `${spark.y}%`,
              }}
            >
              {spark.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 3. Interactive Floating Orbs That She Is Playing With */}
        {orbs.map((orb) => (
          <motion.div
            key={orb.id}
            onClick={(e) => handleOrbClick(e, orb)}
            className="absolute z-30 cursor-pointer group"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
            }}
            whileHover={{ scale: 1.35 }}
            whileTap={{ scale: 0.85 }}
          >
            {/* Glowing Orb Sphere */}
            <div
              className="relative rounded-full flex items-center justify-center shadow-lg transition-transform"
              style={{
                width: `${orb.size}px`,
                height: `${orb.size}px`,
                backgroundColor: `${orb.color}25`,
                border: `1.5px solid ${orb.color}90`,
                boxShadow: `0 0 16px ${orb.color}80, inset 0 0 8px ${orb.color}60`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-ping opacity-75"
                style={{ backgroundColor: orb.color }}
              />

              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-950/90 border border-sky-400/40 text-[9px] font-mono text-sky-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                {orb.label}
              </div>
            </div>
          </motion.div>
        ))}

        {/* 4. Cute Floating Speech / Emotion Reaction Bubble */}
        <motion.div
          className="absolute -top-2 left-6 z-40 px-3.5 py-1.5 rounded-full bg-[#0a1224]/90 border border-sky-500/30 text-xs font-mono text-sky-200 shadow-lg backdrop-blur-md flex items-center gap-2 pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={reactionText}
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{reactionText}</span>
        </motion.div>

        {/* 5. Minimalist floating spark interaction badge */}
        <div className="absolute bottom-2 right-6 z-40 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleGirlClick();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#080d19]/80 hover:bg-sky-950/80 text-sky-300 border border-sky-500/20 backdrop-blur-md transition-colors shadow-md text-xs font-mono"
            title="Click character or move mouse around to spark emotions"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/70" />
            <span>{playScore} sparks</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
