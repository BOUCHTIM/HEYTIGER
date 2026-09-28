'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Route transition: a red panel sweeps in over the page, the route changes underneath,
 * the panel sweeps off to reveal the new page. Same-page hash links glide with Lenis
 * instead. Reduced motion → plain navigation.
 *
 *   const sweep = useSweep();
 *   <a href="/menu" onClick={e => sweep(e, '/menu', 'MENU', 'メニュー')}>
 */
type Phase = 'idle' | 'cover' | 'reveal';
type Sweep = (e: MouseEvent<HTMLElement> | null, href: string, label?: string, jp?: string) => void;

const Ctx = createContext<Sweep>(() => {});
export const useSweep = () => useContext(Ctx);

const lenisOf = () => (window as unknown as { lenis?: { scrollTo: (t: number | string | HTMLElement, o?: object) => void } }).lenis;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function PageSweep({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('idle');
  const [label, setLabel] = useState({ en: '', jp: '' });
  const pending = useRef<string | null>(null);
  const safety = useRef<number>(0);

  const sweep = useCallback<Sweep>((e, href, en = '', jp = '') => {
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)) return; // new tab etc.
    const [path, hash] = href.split('#');
    const samePage = (path === '' || path === pathname);

    if (samePage && hash) {
      e?.preventDefault();
      const el = document.getElementById(hash);
      if (!el) return;
      const lenis = lenisOf();
      if (lenis && !reduced()) lenis.scrollTo(el, { offset: -96, duration: 1.3 });
      else el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
      history.replaceState(null, '', `#${hash}`);
      return;
    }
    if (samePage) { e?.preventDefault(); lenisOf()?.scrollTo(0, { duration: 1.2 }); return; }
    if (reduced()) return; // let the Link/anchor navigate normally

    e?.preventDefault();
    pending.current = href;
    setLabel({ en, jp });
    setPhase('cover');
    router.prefetch(path);
  }, [pathname, router]);

  // cover finished → change route; reveal once the new pathname is in
  const onAnimationEnd = () => {
    if (phase === 'cover' && pending.current) {
      router.push(pending.current);
      // safety: if the route never lands (error, same page), lift the curtain anyway
      safety.current = window.setTimeout(() => { pending.current = null; setPhase('reveal'); }, 2500);
    } else if (phase === 'reveal') {
      setPhase('idle');
    }
  };

  useEffect(() => {
    if (phase !== 'cover' || !pending.current) return;
    const target = pending.current.split('#')[0] || '/';
    if (pathname !== target) return;
    window.clearTimeout(safety.current);
    pending.current = null;
    lenisOf()?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    // give the new page a frame to paint under the curtain
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setPhase('reveal')));
    return () => cancelAnimationFrame(id);
  }, [pathname, phase]);

  return (
    <Ctx.Provider value={sweep}>
      {children}
      <div
        className={`rd-sweep rd-sweep--${phase}`}
        aria-hidden="true"
        onAnimationEnd={onAnimationEnd}
      >
        {phase !== 'idle' && (label.en || label.jp) && (
          <div className="rd-sweep__label">
            {label.jp && <span className="rd-jp" lang="ja">{label.jp}</span>}
            {label.en && <span className="rd-display">{label.en}</span>}
          </div>
        )}
      </div>
    </Ctx.Provider>
  );
}
