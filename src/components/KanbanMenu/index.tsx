'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import Link from 'next/link';

import FilmGrain from '@/components/FilmGrain';
import { TOKENS } from './signs';

const EmberCanvas = dynamic(() => import('@/three/EmberCanvas'), { ssr: false });
import PaperTextureFilter from './PaperTexture';
import TigerBG from './TigerBG';
import Stickers from './Stickers';
import RopeString from './RopeString';
import SignCard from './SignCard';
import SignExpanded from './SignExpanded';
import { SIGNS } from './signs';

/* SSR-safe mobile query (< 768px). Server + first paint = false (desktop). */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobile(mql.matches);
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, []);
  return isMobile;
}

/* card group orchestration — staggered drop-in */
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

export default function KanbanMenu() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const reduceMotion = !!useReducedMotion();
  const isMobile = useIsMobile();
  const selected = SIGNS.find((s) => s.id === selectedId) ?? null;

  /* Esc closes the opened board. */
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedId(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  /* Freeze the wall (and Lenis) behind an opened board. */
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop?: () => void; start?: () => void } }).lenis;
    if (selected) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      lenis?.stop?.();
      return () => {
        document.body.style.overflow = prev;
        lenis?.start?.();
      };
    }
  }, [selected]);

  return (
    <main
      aria-label="Hey Tiger — Menu"
      style={{ position: 'relative', width: '100%', minHeight: '100dvh', background: 'var(--clr-void)', overflow: isMobile ? 'visible' : 'hidden' }}
    >
      {/* The global chopsticks cursor reads as a floating logo on this wall — hide
          it here and restore a normal pointer (scoped to /menu while mounted). */}
      <style>{`.custom-cursor{display:none!important;} body{cursor:auto!important;}`}</style>

      <PaperTextureFilter />

      {/* ── THE WALL ── */}
      {!isMobile && <TigerBG />}

      {/* subtle ember drift — same signature three.js scene, low density */}
      {!isMobile && (
        <EmberCanvas
          density={0.4}
          span={5}
          spread={[12, 3]}
          colorHot={TOKENS.gold}
          colorCool={TOKENS.orange}
          opacity={0.4}
          parallax={0.25}
          sizeRange={[2, 5]}
          style={{ zIndex: 1 }}
        />
      )}

      {/* preserved ghost wordmark (the おいトラ base type) */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '2%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '12vw',
          lineHeight: 0.82,
          color: 'var(--clr-cream)',
          opacity: 0.045,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          zIndex: 0,
        }}
      >
        HEY TIGER
        <span lang="ja" style={{ display: 'block', fontFamily: "var(--font-japanese-serif, serif)", fontSize: '0.5em' }}>
          おいトラ
        </span>
      </span>

      {/* vertical red izakaya strip */}
      <span
        aria-hidden="true"
        lang="ja"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 24,
          background: '#c0271a',
          color: '#f2e4cc',
          writingMode: 'vertical-rl',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "var(--font-japanese-serif, 'Noto Serif JP', serif)",
          fontSize: '0.55rem',
          letterSpacing: '0.12em',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 1,
        }}
      >
        ヘイタイガー居酒屋
      </span>

      <Stickers isMobile={isMobile} />
      {!isMobile && <RopeString />}
      <FilmGrain />

      {/* back home — the only chrome */}
      <Link
        href="/"
        style={{
          position: isMobile ? 'absolute' : 'fixed',
          top: 'clamp(16px, 2.5vw, 28px)',
          left: 'clamp(16px, 3vw, 36px)',
          zIndex: 20,
          fontFamily: 'var(--font-body)',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(200,169,110,0.7)',
          textDecoration: 'none',
        }}
      >
        ← HEY TIGER
      </Link>

      {/* ── THE COLLAGE ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: isMobile ? 'auto' : '100dvh',
          ...(isMobile
            ? { display: 'flex', flexDirection: 'column', gap: 18, padding: 'clamp(64px, 18vw, 96px) clamp(18px, 6vw, 28px) clamp(48px, 16vw, 72px)' }
            : {}),
        }}
      >
        {SIGNS.map((sign) => (
          <SignCard
            key={sign.id}
            sign={sign}
            isMobile={isMobile}
            dimmed={!!selected && selected.id !== sign.id}
            hidden={selected?.id === sign.id}
            reduceMotion={reduceMotion}
            onSelect={() => setSelectedId(sign.id)}
          />
        ))}
      </motion.div>

      {/* ── EXPANDED BOARD ── */}
      <AnimatePresence>
        {selected && (
          <SignExpanded
            key={selected.id}
            sign={selected}
            isMobile={isMobile}
            reduceMotion={reduceMotion}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
