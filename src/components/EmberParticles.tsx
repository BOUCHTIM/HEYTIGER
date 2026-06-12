'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * EmberParticles — lightweight canvas spark field for the hero.
 *
 * Warm embers (brand orange / amber-wood / parchment) spawn at the bottom and
 * drift upward with a slight horizontal sway, fading as they near the top. The
 * field is purely decorative: it sits above the giant ghost word + tiger
 * (z-index 3) and below the foreground copy, with pointer-events disabled.
 *
 * Honours the hero timeline — the canvas fades in `startDelay`ms after `active`
 * flips true (the loader reveal). Under reduced-motion it renders a sparse,
 * static set of embers instead of animating.
 */
interface EmberParticlesProps {
  /** Start drifting once true — gate this on the loader-done signal. */
  active?: boolean;
  /** Delay (ms) before the field fades in + starts, per the hero timeline. */
  startDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** Warm ember palette — brand tokens (tiger ember / amber-wood / parchment). */
const EMBER_RGB = [
  '224, 86, 40',   // tiger ember — warmed --clr-red so sparks read as fire
  '193, 123, 63',  // --amber-wood
  '240, 235, 216', // --parchment
];

interface Spark {
  x: number;
  y: number;
  r: number;
  vy: number;        // upward speed, px per 16.7ms frame
  swayAmp: number;   // horizontal sway amplitude (px)
  swayHz: number;    // sway speed
  phase: number;
  rgb: string;
  peak: number;      // peak alpha 0.4–0.8
}

const COUNT = 30;

export default function EmberParticles({
  active = true,
  startDelay = 0,
  className,
  style,
}: EmberParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = !!useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

    /** Place a spark at the bottom with fresh randomised motion. */
    const spawn = (s: Spark, atBottom = true): Spark => {
      s.r = rand(1, 2) + rand(0, 1); // 1–4px
      s.x = rand(0, width || 1);
      s.y = atBottom ? height + s.r + rand(0, height * 0.4) : rand(0, height || 1);
      s.vy = rand(0.3, 0.8);
      s.swayAmp = rand(6, 22);
      s.swayHz = rand(0.005, 0.02);
      s.phase = rand(0, Math.PI * 2);
      s.rgb = pick(EMBER_RGB);
      s.peak = rand(0.4, 0.8);
      return s;
    };

    const sparks: Spark[] = Array.from({ length: COUNT }, () =>
      spawn({} as Spark, false),
    );

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const drawSpark = (s: Spark) => {
      // Vertical fade: ease in off the bottom, fade out approaching the top.
      const bottomFade = Math.min(1, (height - s.y) / (height * 0.12));
      const topFade = Math.min(1, s.y / (height * 0.3));
      const alpha = s.peak * Math.max(0, Math.min(bottomFade, topFade));
      if (alpha <= 0) return;
      const x = s.x + Math.sin(s.phase) * s.swayAmp;
      ctx.beginPath();
      ctx.arc(x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.rgb}, ${alpha})`;
      ctx.shadowColor = `rgba(${s.rgb}, ${alpha})`;
      ctx.shadowBlur = s.r * 3;
      ctx.fill();
    };

    /* ── Reduced motion: paint a sparse static field once, no loop. ── */
    if (reduceMotion) {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < 8; i++) {
        const s = spawn({} as Spark, false);
        s.peak *= 0.5;
        drawSpark(s);
      }
      ctx.shadowBlur = 0;
      canvas.style.opacity = '1';
      return () => ro.disconnect();
    }

    let raf = 0;
    let last = performance.now();
    let running = false;

    const frame = (now: number) => {
      const dt = Math.min(2.5, (now - last) / 16.7); // normalise to 60fps steps
      last = now;
      ctx.clearRect(0, 0, width, height);
      for (const s of sparks) {
        s.y -= s.vy * dt;
        s.phase += s.swayHz * dt * 4;
        if (s.y < -s.r) spawn(s, true);
        drawSpark(s);
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      canvas.style.opacity = '1';
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    let startTimer: number | undefined;
    if (active) {
      startTimer = window.setTimeout(start, startDelay);
    }

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      if (startTimer) clearTimeout(startTimer);
    };
  }, [active, startDelay, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 3,
        pointerEvents: 'none',
        opacity: reduceMotion ? 1 : 0,
        transition: 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
    />
  );
}
