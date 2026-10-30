import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

interface TrailParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
  color: string;
}

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverType, setHoverType] = useState<'default' | 'button' | 'link' | 'card'>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosRef = useRef({ x: -100, y: -100 });
  const lastMousePosRef = useRef({ x: -100, y: -100 });

  // Spring physics for smooth follower ring
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool for futuristic cinematic trail
    const particles: TrailParticle[] = [];
    const colors = ['#38bdf8', '#7dd3fc', '#0ea5e9', '#bae6fd', '#818cf8'];

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      const x = e.clientX;
      const y = e.clientY;

      mousePosRef.current = { x, y };
      cursorX.set(x);
      cursorY.set(y);

      // Spawn trail particles based on movement velocity
      const dx = x - lastMousePosRef.current.x;
      const dy = y - lastMousePosRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 3) {
        const count = Math.min(3, Math.max(1, Math.floor(dist / 12)));
        for (let i = 0; i < count; i++) {
          particles.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 6,
            size: Math.random() * 2.2 + 1.2,
            alpha: 0.7,
            vx: -dx * 0.05 + (Math.random() - 0.5) * 0.8,
            vy: -dy * 0.05 + (Math.random() - 0.5) * 0.8,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }
      lastMousePosRef.current = { x, y };
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Dynamic hover detection for interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, input, select, textarea, [role="button"], [data-cursor], .cursor-pointer'
      );

      if (interactive) {
        setIsHovering(true);
        if (interactive.tagName === 'BUTTON' || interactive.getAttribute('role') === 'button') {
          setHoverType('button');
        } else if (interactive.tagName === 'A') {
          setHoverType('link');
        } else {
          setHoverType('card');
        }
      } else {
        setIsHovering(false);
        setHoverType('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleElementHover);

    // Particle render loop
    let animationFrameId: number;
    const renderTrail = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & update trail particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        p.size *= 0.96;

        if (p.alpha <= 0.01 || p.size <= 0.3) {
          particles.splice(i, 1);
          continue;
        }

        // Draw soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha * 0.25})`;
        ctx.fill();

        // Draw bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animationFrameId = requestAnimationFrame(renderTrail);
    };

    renderTrail();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleElementHover);
      cancelAnimationFrame(animationFrameId);
    };
  }, [cursorX, cursorY]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Particle trail canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998] block"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Trailing Outer Glow Ring with Spring Physics */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border flex items-center justify-center -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          x: smoothX,
          y: smoothY,
        }}
        animate={{
          width: isHovering ? 46 : isClicking ? 20 : 30,
          height: isHovering ? 46 : isClicking ? 20 : 30,
          borderColor: isHovering
            ? 'rgba(56, 189, 248, 0.9)'
            : 'rgba(56, 189, 248, 0.35)',
          backgroundColor: isHovering
            ? 'rgba(56, 189, 248, 0.12)'
            : isClicking
            ? 'rgba(56, 189, 248, 0.25)'
            : 'rgba(56, 189, 248, 0.04)',
          boxShadow: isHovering
            ? '0 0 20px rgba(56, 189, 248, 0.4), inset 0 0 10px rgba(56, 189, 248, 0.2)'
            : '0 0 10px rgba(56, 189, 248, 0.15)',
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        {/* Subtle crosshair or corner markers when hovering interactive element */}
        {isHovering && (
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 45 }}
            exit={{ scale: 0 }}
            className="w-2.5 h-2.5 border-t border-r border-sky-300 pointer-events-none opacity-80"
          />
        )}
      </motion.div>

      {/* Sharp Instant Inner Pinpoint Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] w-1.5 h-1.5 rounded-full bg-sky-200 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_#38bdf8]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isClicking ? 0.6 : isHovering ? 1.4 : 1,
          backgroundColor: isHovering ? '#bae6fd' : '#e0f2fe',
        }}
        transition={{ duration: 0.08 }}
      />
    </>
  );
}
