'use client';

import { useEffect, useRef } from 'react';

/**
 * FilmGrain — animated photographic grain layer for the cinematic hero.
 *
 * Full-viewport canvas painted with per-pixel noise each frame, composited with
 * `mix-blend-mode: overlay`. Honours prefers-reduced-motion by painting a single
 * static frame instead of the per-frame flicker (a fast full-screen flicker is a
 * photosensitivity concern). Note: a lighter CSS grain already runs site-wide via
 * <GlobalGrain/>; this is the heavier, hero-scoped cinematic grain.
 */
export default function FilmGrain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let id = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const paint = () => {
      const { width, height } = canvas;
      const img = ctx.createImageData(width, height);
      const data = img.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = data[i + 1] = data[i + 2] = v;
        data[i + 3] = 10;
      }
      ctx.putImageData(img, 0, 0);
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      paint(); // single static frame — no animation loop
    } else {
      const draw = () => {
        paint();
        id = requestAnimationFrame(draw);
      };
      draw();
    }

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        mixBlendMode: 'overlay',
      }}
    />
  );
}
