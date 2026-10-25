import React, { useEffect, useRef } from 'react';

interface WhiteDot {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  phase: number;
  speed: number;
  hasAmbientGlow: boolean;
  glowRadius: number;
}

/**
 * White dot canvas with ambient lighting on pure black background.
 * Provides subtle twinkling white dots and soft ambient radial halos.
 */
export const StarfieldCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrame = 0;
    let dots: WhiteDot[] = [];
    let width = 0;
    let height = 0;

    const random = (() => {
      let seed = 9137;
      return () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
    })();

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(scale, 0, 0, scale, 0, 0);

      // Density tuned for high-end ambient aesthetic
      const count = Math.min(220, Math.max(90, Math.round((width * height) / 10000)));
      dots = Array.from({ length: count }, () => {
        const hasAmbientGlow = random() > 0.72;
        const radius = hasAmbientGlow ? random() * 1.4 + 1.2 : random() * 0.9 + 0.35;
        return {
          x: random() * width,
          y: random() * height,
          radius,
          opacity: random() * 0.45 + 0.45,
          phase: random() * Math.PI * 2,
          speed: random() * 0.6 + 0.2,
          hasAmbientGlow,
          glowRadius: radius * (random() * 8 + 6),
        };
      });
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);

      for (const dot of dots) {
        const shimmer = reducedMotion
          ? 1
          : 0.7 + Math.sin(time * 0.0012 * dot.speed + dot.phase) * 0.3;
        const alpha = dot.opacity * shimmer;

        // Ambient white radiant lighting halo for larger dots
        if (dot.hasAmbientGlow) {
          const ambientGlow = context.createRadialGradient(
            dot.x,
            dot.y,
            0,
            dot.x,
            dot.y,
            dot.glowRadius
          );
          ambientGlow.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.75})`);
          ambientGlow.addColorStop(0.2, `rgba(240, 245, 255, ${alpha * 0.35})`);
          ambientGlow.addColorStop(0.6, `rgba(220, 230, 255, ${alpha * 0.08})`);
          ambientGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

          context.fillStyle = ambientGlow;
          context.beginPath();
          context.arc(dot.x, dot.y, dot.glowRadius, 0, Math.PI * 2);
          context.fill();
        }

        // Crisp central white core dot
        context.beginPath();
        context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        context.fill();
      }

      if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[1] pointer-events-none"
    />
  );
};
