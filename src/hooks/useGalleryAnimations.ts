import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

type NullableRef<T> = { current: T | null };
type NullableDivArray = { current: (HTMLDivElement | null)[] };

/**
 * Drives a pinned, cross-dissolving gallery: slow push-in per shot +
 * caption drift in/out + cross-dissolve to the next frame.
 * Extracted from CinematicCamera for reuse and clean separation of concerns.
 */
export function useGalleryAnimations(
  sectionRef:  NullableRef<HTMLElement>,
  wrapRefs:    NullableDivArray,
  imgRefs:     NullableDivArray,
  textRefs:    NullableDivArray,
  shotCount:   number
) {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const lenis = (window as unknown as {
        lenis?: {
          on?:  (e: string, cb: () => void) => void;
          off?: (e: string, cb: () => void) => void;
        };
      }).lenis;

      const onLenis = () => ScrollTrigger.update();
      lenis?.on?.('scroll', onLenis);

      const wraps = wrapRefs.current;
      const imgs  = imgRefs.current;
      const texts = textRefs.current;

      // First shot visible; rest stacked under.
      gsap.set(wraps[0], { opacity: 1 });
      gsap.set(wraps.slice(1), { opacity: 0 });
      gsap.set(imgs, { scale: 1.22 });
      gsap.set(texts, { opacity: 0, y: 24 });

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${window.innerHeight * shotCount}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        for (let i = 0; i < shotCount; i++) {
          // Slow push-in across the whole segment.
          tl.fromTo(imgs[i], { scale: 1.22 }, { scale: 1, ease: 'none', duration: 1 }, i);

          // Caption: drift in → hold → drift out.
          tl.to(texts[i], { opacity: 1, y: 0,   duration: MOTION.fast, ease: 'power2.out' }, i + 0.08);
          tl.to(texts[i], { opacity: 0, y: -16,  duration: 0.25,       ease: 'power2.in'  }, i + 0.65);

          // Cross-dissolve.
          if (i < shotCount - 1) {
            tl.to(wraps[i],     { opacity: 0, duration: MOTION.fast, ease: 'none' }, i + 0.75);
            tl.to(wraps[i + 1], { opacity: 1, duration: MOTION.fast, ease: 'none' }, i + 0.75);
          }
        }

        return () => lenis?.off?.('scroll', onLenis);
      });

      const refresh = () => ScrollTrigger.refresh();
      (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready.then(refresh);
      window.addEventListener('load', refresh);

      return () => {
        lenis?.off?.('scroll', onLenis);
        window.removeEventListener('load', refresh);
      };
    }, section);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shotCount]);
}
