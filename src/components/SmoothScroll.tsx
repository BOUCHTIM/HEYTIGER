'use client';

import { useEffect, useCallback } from 'react';
import Lenis from 'lenis';

/* Lenis ships its own (narrower) `win().lenis` typing; widen it locally. */
const win = () => window as unknown as { lenis?: Lenis };

export function useLenis() {
  const stop = useCallback(() => {
    const lenis = win().lenis;
    if (lenis) {
      lenis.stop();
      document.documentElement.classList.add('lenis-stopped');
    }
  }, []);

  const start = useCallback(() => {
    const lenis = win().lenis;
    if (lenis) {
      lenis.start();
      document.documentElement.classList.remove('lenis-stopped');
    }
  }, []);

  return { stop, start };
}

export default function SmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Skip smooth scroll for reduced motion users
      return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
    });

    // Expose on window for easy access
    win().lenis = lenis;

    // Animation loop
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      win().lenis = undefined;
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
    };
  }, []);

  return null;
}
