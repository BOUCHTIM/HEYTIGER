import { MOTION, EASE } from '@/lib/motion';

/**
 * Returns Framer Motion animation props for the hero sequence.
 * The hero uses Framer Motion (not GSAP); this hook centralises token values
 * so timing is governed by motion.ts, not inline magic numbers.
 */
export function useHeroAnimations(playCinema: boolean) {
  const delay = (ms: number) => (playCinema ? ms / 1000 : 0);

  const slideUp = (delayMs: number) => ({
    initial: playCinema ? { y: '100%', opacity: 0 } : false,
    animate: { y: '0%', opacity: 1 },
    transition: {
      duration: MOTION.section,
      delay: delay(delayMs),
      ease: EASE.cinematic,
    },
  });

  const fadeIn = (delayMs: number, from: Record<string, unknown> = {}) => ({
    initial: playCinema ? { opacity: 0, ...from } : false,
    animate: { opacity: 1 },
    transition: {
      duration: MOTION.fast,
      delay: delay(delayMs),
    },
  });

  return { delay, slideUp, fadeIn };
}
