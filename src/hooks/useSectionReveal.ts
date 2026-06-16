import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION, STAGGER, EASE } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

interface SectionRevealOptions {
  /** CSS selector for elements to animate inside the container */
  selector?: string;
  stagger?: number;
  duration?: number;
  /** Initial Y offset in px */
  y?: number;
  /** ScrollTrigger start string */
  start?: string;
}

/**
 * Attach to a section container. Elements matching `selector` (default
 * `[data-reveal]`) fade + slide in on scroll, respecting reduced-motion.
 */
export function useSectionReveal<T extends HTMLElement = HTMLDivElement>(
  options: SectionRevealOptions = {}
) {
  const ref = useRef<T>(null);

  const {
    selector = '[data-reveal]',
    stagger  = STAGGER.section,
    duration = MOTION.section,
    y        = 32,
    start    = 'top 85%',
  } = options;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const targets = el.querySelectorAll(selector);
        if (!targets.length) return;

        gsap.fromTo(
          targets,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            ease: `cubic-bezier(${EASE.cinematic.join(',')})`,
            scrollTrigger: {
              trigger: el,
              start,
              once: true,
            },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, [duration, stagger, y, start, selector]);

  return ref;
}
