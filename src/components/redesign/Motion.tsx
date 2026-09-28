'use client';

import { useEffect, useRef } from 'react';
import { useLoaderDone } from '@/hooks/useLoaderDone';

/**
 * Scroll motion for the redesign, driven by data attributes (styles in redesign.css):
 *
 *   data-reveal="up|fade|right|mask|zoom|stamp"  — plays once when the element enters the viewport
 *   data-reveal-group                             — children with data-reveal get a stagger index (--i)
 *   data-reveal-proxy                             — children reveal when THIS box enters (horizontal rows)
 *   data-parallax="0.08"                          — vertical drift proportional to distance from viewport centre
 *
 * Hero reveals wait for the loader curtain; everything is inert under prefers-reduced-motion.
 *
 * Note: Chrome's IntersectionObserver honours clip-path, so a fully clipped "mask" title never
 * intersects on its own — mask elements are observed through their parent instead.
 */
const HERO = '#hero';

export default function Motion() {
  const ready = useLoaderDone();
  const observeEl = useRef<(el: HTMLElement) => void>(() => {});
  const heroArmed = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    root.classList.add('rd-motion');

    const index = (scope: ParentNode) => {
      scope.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach(group => {
        let i = 0;
        group.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
          if (el.closest('[data-reveal-group]') === group) el.style.setProperty('--i', String(i++));
        });
      });
    };

    const proxied = new Map<Element, Set<HTMLElement>>();
    const reveal = (el: Element) => el.classList.add('is-in');

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          if ((e.target as HTMLElement).dataset.reveal !== undefined) reveal(e.target);
          proxied.get(e.target)?.forEach(reveal);
          proxied.delete(e.target);
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    );

    // nearest ancestor that actually has a box (skips display: contents wrappers)
    const boxed = (start: HTMLElement | null) => {
      let p = start;
      while (p && (getComputedStyle(p).display === 'contents' || p.getBoundingClientRect().height === 0)) p = p.parentElement;
      return p;
    };

    observeEl.current = (el: HTMLElement) => {
      if (el.classList.contains('is-in')) return;
      const row = el.parentElement?.closest('[data-reveal-proxy]') ?? null;
      const proxy = row ?? (el.dataset.reveal === 'mask' ? boxed(el.parentElement) : null);
      if (proxy && proxy !== el) {
        const set = proxied.get(proxy) ?? new Set<HTMLElement>();
        set.add(el);
        proxied.set(proxy, set);
        io.observe(proxy);
        return;
      }
      io.observe(el);
    };

    const observe = (scope: ParentNode) => {
      index(scope);
      scope.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)').forEach(el => {
        if (!heroArmed.current && el.closest(HERO)) return; // hero waits for the curtain
        observeEl.current(el);
      });
    };
    observe(document);

    // cards re-render on filter changes — pick up new nodes
    const mo = new MutationObserver(muts => {
      for (const m of muts) m.addedNodes.forEach(n => { if (n instanceof HTMLElement) observe(n.parentElement ?? n); });
    });
    const main = document.querySelector('main');
    if (main) mo.observe(main, { childList: true, subtree: true });

    // parallax
    const layers = [...document.querySelectorAll<HTMLElement>('[data-parallax]')].map(el => ({
      el, f: parseFloat(el.dataset.parallax || '0'),
    }));
    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const { el, f } of layers) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue;
        const c = r.top + r.height / 2 - vh / 2;
        el.style.setProperty('--py', `${(-c * f).toFixed(1)}px`);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    tick();

    return () => {
      root.classList.remove('rd-motion');
      io.disconnect();
      mo.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // arm the hero once the loader has parted (or after a safety timeout)
  useEffect(() => {
    if (heroArmed.current) return;
    const arm = () => {
      if (heroArmed.current) return;
      heroArmed.current = true;
      document.querySelectorAll<HTMLElement>(`${HERO} [data-reveal]:not(.is-in)`).forEach(el => observeEl.current(el));
    };
    if (ready) { arm(); return; }
    const t = window.setTimeout(arm, 4000);
    return () => window.clearTimeout(t);
  }, [ready]);

  return null;
}
