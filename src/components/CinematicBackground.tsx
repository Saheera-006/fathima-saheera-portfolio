
import { useEffect, useRef } from 'react';

interface CinematicBackgroundProps {
  scrollProgress: number;
  mousePos: { x: number; y: number };
  activeStageIndex: number;
}

interface EmotionParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  glyph: string;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  swaySpeed: number;
  swayPhase: number;
}

export function CinematicBackground({
  scrollProgress,
  mousePos,
  activeStageIndex,
}: CinematicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // =========================================
    // 1. DEEP 3D SPACE PARTICLE POOL
    // =========================================

    const PARTICLE_COUNT = 70;

    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const symbols = ['<>', '{}', '</>', '01', 'λ', '||', '=>', 'API', 'db', 'fn()'];

      return {
        id: i,
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 2000,
        baseSize: Math.random() * 2 + 1,
        speedZ: Math.random() * 1.5 + 0.8,
        symbol: Math.random() > 0.6
          ? symbols[Math.floor(Math.random() * symbols.length)]
          : null,
        opacity: Math.random() * 0.7 + 0.2,
        pulseOffset: Math.random() * Math.PI * 2,
      };
    });

    // =========================================
    // 2. MOUSE MOVING EMOTION PARTICLES
    // =========================================

    const emotionParticles: EmotionParticle[] = [];

    const emotionGlyphs = [
      '✨', '{</>}', '💫', '🌸', '♡',
      '💡', '✦', 'λ', '01', '{}', '☕',
    ];

    // Midnight blue colour family
    const emotionColors = [
      'rgba(37, 99, 235, ',
      'rgba(59, 130, 246, ',
      'rgba(96, 165, 250, ',
      'rgba(147, 197, 253, ',
    ];

    let lastMouseX = window.innerWidth / 2;
    let lastMouseY = window.innerHeight / 2;
    let currentRawMouseX = window.innerWidth / 2;
    let currentRawMouseY = window.innerHeight / 2;
    let mouseSpeed = 0;

    const handleWindowMouseMove = (e: MouseEvent) => {
      currentRawMouseX = e.clientX;
      currentRawMouseY = e.clientY;

      const dx = currentRawMouseX - lastMouseX;
      const dy = currentRawMouseY - lastMouseY;
      const dist = Math.hypot(dx, dy);

      mouseSpeed = Math.min(dist * 0.5, 30);

      if (dist > 18 && emotionParticles.length < 35) {
        const glyph =
          emotionGlyphs[Math.floor(Math.random() * emotionGlyphs.length)];

        const colorPrefix =
          emotionColors[Math.floor(Math.random() * emotionColors.length)];

        const isSymbol =
          glyph.startsWith('{') || glyph === 'λ' || glyph === '01';

        emotionParticles.push({
          x: currentRawMouseX + (Math.random() - 0.5) * 24,
          y: currentRawMouseY + (Math.random() - 0.5) * 24,
          vx: (Math.random() - 0.5) * 0.8 - dx * 0.02,
          vy: -Math.random() * 1.2 - 0.6,
          glyph,
          size: isSymbol
            ? Math.random() * 3 + 11
            : Math.random() * 4 + 13,
          alpha: Math.random() * 0.35 + 0.45,
          decay: Math.random() * 0.012 + 0.008,
          color: colorPrefix,
          swaySpeed: Math.random() * 2 + 1.5,
          swayPhase: Math.random() * Math.PI * 2,
        });

        lastMouseX = currentRawMouseX;
        lastMouseY = currentRawMouseY;
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove, {
      passive: true,
    });

    // =========================================
    // 3. CAMERA STATE
    // =========================================

    let cameraZ = 0;
    let cameraRotX = 0;
    let cameraRotY = 0;
    let time = 0;

    const render = () => {
      time += 0.015;

      const targetZ = scrollProgress * 3000;
      const targetRotX = mousePos.y * 0.08;
      const targetRotY = mousePos.x * 0.08;

      cameraZ += (targetZ - cameraZ) * 0.05;
      cameraRotX += (targetRotX - cameraRotX) * 0.05;
      cameraRotY += (targetRotY - cameraRotY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // =========================================
      // 4. MIDNIGHT BLACK BACKGROUND
      // =========================================

      const bgGrad = ctx.createRadialGradient(
        width / 2 + mousePos.x * 60,
        height * 0.4 + mousePos.y * 40,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.85
      );

      bgGrad.addColorStop(0, '#101C35');
      bgGrad.addColorStop(0.35, '#0B1428');
      bgGrad.addColorStop(0.7, '#070A12');
      bgGrad.addColorStop(1, '#03050A');

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // =========================================
      // 5. BLUE ATMOSPHERIC SPOTLIGHT
      // =========================================

      const spotGrad = ctx.createRadialGradient(
        width / 2 + mousePos.x * 120,
        height * 0.35 + mousePos.y * 80,
        0,
        width / 2,
        height * 0.35,
        width * 0.55
      );

      const blueAlpha = 0.07 + Math.min(scrollProgress * 0.05, 0.06);

      spotGrad.addColorStop(
        0,
        `rgba(37, 99, 235, ${blueAlpha})`
      );

      spotGrad.addColorStop(
        0.5,
        'rgba(30, 64, 175, 0.025)'
      );

      spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, width, height);

      // =========================================
      // 6. MOUSE FOLLOWING BLUE AURA
      // =========================================

      if (currentRawMouseX > 0 && currentRawMouseY > 0) {
        const mouseAura = ctx.createRadialGradient(
          currentRawMouseX,
          currentRawMouseY,
          0,
          currentRawMouseX,
          currentRawMouseY,
          160 + mouseSpeed * 3
        );

        const auraAlpha = Math.min(
          0.06,
          0.025 + mouseSpeed * 0.002
        );

        mouseAura.addColorStop(
          0,
          `rgba(59, 130, 246, ${auraAlpha})`
        );

        mouseAura.addColorStop(
          0.5,
          `rgba(37, 99, 235, ${auraAlpha * 0.4})`
        );

        mouseAura.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = mouseAura;
        ctx.fillRect(0, 0, width, height);
      }

      // =========================================
      // 7. 3D PERSPECTIVE FLOOR / GRID
      // =========================================

      const horizonY = height * 0.55 + cameraRotX * 300;
      const fov = 450;
      const gridSpacing = 80;
      const gridZSpeed = (time * 15 + cameraZ * 0.4) % gridSpacing;

      ctx.save();

      ctx.strokeStyle = 'rgba(59, 130, 246, 0.065)';
      ctx.lineWidth = 1;

      const vanishingX = width / 2 + cameraRotY * 400;
      const numRays = 16;

      // Perspective rays
      for (let i = -numRays; i <= numRays; i++) {
        const spreadX = vanishingX + (i * width) / 10;

        ctx.beginPath();
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(spreadX, height + 100);
        ctx.stroke();
      }

      // Horizontal depth grid lines
      for (let z = 50; z < 800; z += 50) {
        const adjustedZ = z - gridZSpeed;

        if (adjustedZ <= 10) continue;

        const scale = fov / adjustedZ;
        const lineY = horizonY + 80 * scale;

        if (lineY > height + 50) continue;

        const lineAlpha = Math.max(
          0,
          (1 - adjustedZ / 800) * 0.12
        );

        ctx.strokeStyle = `rgba(59, 130, 246, ${lineAlpha})`;

        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(width, lineY);
        ctx.stroke();
      }

      ctx.restore();

      // =========================================
      // 8. FLOATING 3D PARTICLES & SYMBOLS
      // =========================================

      ctx.save();

      particles.forEach((p) => {
        p.z -= p.speedZ + scrollProgress * 2;

        if (p.z < 20) {
          p.z = 2000;
          p.x = (Math.random() - 0.5) * 2200;
          p.y = (Math.random() - 0.5) * 2000;
        }

        const depth = p.z;
        const scale = fov / depth;

        const screenX =
          width / 2 + (p.x + cameraRotY * 500) * scale;

        const screenY =
          height / 2 + (p.y + cameraRotX * 500) * scale;

        if (
          screenX < -50 ||
          screenX > width + 50 ||
          screenY < -50 ||
          screenY > height + 50
        ) {
          return;
        }

        const distanceAlpha = Math.min(
          1,
          Math.max(0, (1 - depth / 2000) * p.opacity)
        );

        const pulse = 1 + Math.sin(time * 2 + p.pulseOffset) * 0.15;

        if (p.symbol) {
          ctx.font = `${Math.max(
            10,
            Math.floor(13 * scale * pulse)
          )}px 'JetBrains Mono', monospace`;

          ctx.fillStyle = `rgba(147, 197, 253, ${distanceAlpha * 0.45})`;

          ctx.fillText(p.symbol, screenX, screenY);
        } else {
          ctx.beginPath();

          ctx.arc(
            screenX,
            screenY,
            Math.max(0.8, p.baseSize * scale * pulse),
            0,
            Math.PI * 2
          );

          ctx.fillStyle = `rgba(96, 165, 250, ${distanceAlpha * 0.8})`;
          ctx.fill();

          if (depth < 600) {
            ctx.beginPath();

            ctx.arc(
              screenX,
              screenY,
              p.baseSize * scale * 3.5,
              0,
              Math.PI * 2
            );

            ctx.fillStyle = `rgba(59, 130, 246, ${distanceAlpha * 0.15})`;
            ctx.fill();
          }
        }
      });

      ctx.restore();

      // =========================================
      // 9. FLOATING MOUSE EMOTION PARTICLES
      // =========================================

      if (emotionParticles.length > 0) {
        ctx.save();

        for (let i = emotionParticles.length - 1; i >= 0; i--) {
          const ep = emotionParticles[i];

          ep.x +=
            ep.vx +
            Math.sin(time * ep.swaySpeed + ep.swayPhase) * 0.4;

          ep.y += ep.vy;
          ep.alpha -= ep.decay;

          if (ep.alpha <= 0) {
            emotionParticles.splice(i, 1);
            continue;
          }

          ctx.save();

          ctx.font = `${Math.round(ep.size)}px 'Segoe UI Emoji', 'Apple Color Emoji', 'JetBrains Mono', monospace`;

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          ctx.shadowColor = `${ep.color}0.5)`;
          ctx.shadowBlur = 10;

          ctx.fillStyle = `${ep.color}${ep.alpha})`;

          ctx.fillText(ep.glyph, ep.x, ep.y);

          ctx.restore();
        }

        ctx.restore();
      }

      // =========================================
      // 10. SUBTLE BLUE HORIZON BEAM
      // =========================================

      ctx.save();

      const beamY = horizonY;

      const stageGlow = ctx.createLinearGradient(
        0,
        beamY,
        width,
        beamY
      );

      stageGlow.addColorStop(
        0,
        'rgba(59, 130, 246, 0)'
      );

      stageGlow.addColorStop(
        0.5,
        `rgba(59, 130, 246, ${0.08 + activeStageIndex * 0.015})`
      );

      stageGlow.addColorStop(
        1,
        'rgba(59, 130, 246, 0)'
      );

      ctx.fillStyle = stageGlow;
      ctx.fillRect(0, beamY - 1, width, 2);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollProgress, mousePos, activeStageIndex]);

  return (
    <div
      id="cinematic-canvas-container"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Subtle Midnight Blue edge vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#070A12]/40 to-[#03050A] pointer-events-none" />
    </div>
  );
}
