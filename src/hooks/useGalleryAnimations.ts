import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

type NullableRef<T> = { current: T | null };
type NullableDivArray = { current: (HTMLDivElement | null)[] };

/**
 * Drives a pinned, cross-dissolving gallery: slow push-in per shot +
 * staggered caption reveal (eyebrow → title → body) + cross-dissolve.
 * Extracted from CinematicCamera for reuse and clean separation of concerns.
 */
export function useGalleryAnimations(
  sectionRef:   NullableRef<HTMLElement>,
  wrapRefs:     NullableDivArray,
  imgRefs:      NullableDivArray,
  textRefs:     NullableDivArray,
  shotCount:    number,
  progressRef?: NullableRef<HTMLDivElement>
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

      // Caption containers always visible; children animate individually.
      gsap.set(texts, { opacity: 1 });
      texts.forEach(text => {
        if (text) gsap.set(text.children, { opacity: 0, y: 18 });
      });

      if (progressRef?.current) {
        gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' });
      }

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
          const els = texts[i] ? Array.from(texts[i]!.children) : [];

          // Slow push-in across the whole segment.
          tl.fromTo(imgs[i], { scale: 1.22 }, { scale: 1, ease: 'none', duration: 1 }, i);

          // Caption in — staggered: eyebrow → title → body.
          if (els[0]) tl.fromTo(els[0], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' }, i + 0.06);
          if (els[1]) tl.fromTo(els[1], { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' }, i + 0.12);
          if (els[2]) tl.fromTo(els[2], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' }, i + 0.20);

          // Caption out — reverse stagger: body → title → eyebrow.
          if (els[2]) tl.fromTo(els[2], { opacity: 1, y: 0 }, { opacity: 0, y: -10, duration: 0.12, ease: 'power2.in' }, i + 0.62);
          if (els[1]) tl.fromTo(els[1], { opacity: 1, y: 0 }, { opacity: 0, y: -16, duration: 0.13, ease: 'power2.in' }, i + 0.67);
          if (els[0]) tl.fromTo(els[0], { opacity: 1, y: 0 }, { opacity: 0, y: -10, duration: 0.11, ease: 'power2.in' }, i + 0.72);

          // Cross-dissolve.
          if (i < shotCount - 1) {
            tl.to(wraps[i],     { opacity: 0, duration: MOTION.fast, ease: 'none' }, i + 0.78);
            tl.to(wraps[i + 1], { opacity: 1, duration: MOTION.fast, ease: 'none' }, i + 0.78);
          }
        }

        // Progress bar — fills left-to-right across entire scroll.
        if (progressRef?.current) {
          tl.fromTo(
            progressRef.current,
            { scaleX: 0 },
            { scaleX: 1, ease: 'none', duration: shotCount },
            0
          );
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
