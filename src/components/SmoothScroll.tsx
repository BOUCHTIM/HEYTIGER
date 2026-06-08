'use client';

/**
 * SmoothScroll
 * Lenis-based smooth scroll that matches the buttery lerp of the
 * StringTune reference site (string-tune.fiddle.digital).
 *
 * Lenis drives window.scrollY — so StringTune in `default` mode
 * reads the updated scroll position on every rAF, giving both:
 *   • silky lerped page scroll
 *   • correct StringTune --progress on all [string="parallax"] elements
 */

import { useEffect } from 'react';
import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      // Exponential ease-out — the same curve StringTune ships as default
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2.0,
      infinite: false,
    });

    window.__lenis = lenis;
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Lenis doesn't fire after momentum completes — dispatch a final scroll
    // event so StringTune's --progress values settle to their resting state.
    lenis.on('scroll', () => {
      window.dispatchEvent(new Event('scroll', { bubbles: false }));
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
