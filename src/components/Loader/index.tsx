'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import Counter from './Counter';
import Panels from './Panels';
import LoaderContent from './LoaderContent';
import { setLoaderDone } from '@/hooks/useLoaderDone';

const SESSION_KEY = 'ht_loaded';

/* ── Phase timing (ms) — total ≈ 2.8s ─────────────────────────────── */
const COUNT_MS = 1800; // Phase 1: counter 0 → 100
const HOLD_MS = 200; // Phase 2: brief beat at 100 before the wipe
const WIPE_MS = 800; // Phase 3: per-panel wipe duration
const WIPE_STAGGER_MS = 80; // Phase 3: right panel trails the left
const REVEAL_RATIO = 0.6; // Phase 4: hero signal fires at 60% of the wipe

type Phase = 'enter' | 'hold' | 'exit';

interface LoaderProps {
  /** Fires once, after the curtains have fully parted and the loader unmounts. */
  onComplete?: () => void;
}

/**
 * Hey Tiger cinematic loader.
 *
 *   Phase 1 ENTER  — solid #0a0a08 cover; counter 0→100, brand reveals in.
 *   Phase 2 HOLD   — counter hits 100, the brand stack fades (bg stays).
 *   Phase 3 EXIT   — two solid panels part from the centre (curtain wipe).
 *   Phase 4 REVEAL — at 60% of the wipe, useLoaderDone() flips true so the
 *                    hero can animate in underneath.
 *
 * Z-INDEX (rule #7): wrapper 9998 · panels 9999 · content 10000. The wrapper
 * is solid during cover phases and goes transparent at EXIT, so the panel wipe
 * actually reveals the hero rather than a wrapper background — that, together
 * with the two SOLID panels, is the fix for the old bleed-through bug.
 */
export default function Loader({ onComplete }: LoaderProps) {
  const reduceMotion = !!useReducedMotion();
  // Cover from the very first paint (constant initial state ⇒ SSR-safe, no
  // hydration mismatch). The decide-effect drops it for returning sessions.
  const [active, setActive] = useState(true);
  const [phase, setPhase] = useState<Phase>('enter');
  // QA time multiplier (?loaderSlow=N, 1–8×) for inspecting each phase.
  const [slow, setSlow] = useState(1);
  const decidedRef = useRef(false);

  const countMs = COUNT_MS * slow; // Counter duration
  const wipeMs = WIPE_MS * slow; // Panels wipe duration

  /* Show once per session. ?loader=1 forces a replay, ?loader=off disables. */
  useEffect(() => {
    if (decidedRef.current) return;
    decidedRef.current = true;

    let show = true;
    try {
      const sp = new URLSearchParams(window.location.search);
      const flag = sp.get('loader');
      if (flag === 'off') show = false;
      else if (flag === '1') show = true;
      else if (sessionStorage.getItem(SESSION_KEY) === '1') show = false;
      sessionStorage.setItem(SESSION_KEY, '1');

      const slowParam = Number(sp.get('loaderSlow'));
      if (Number.isFinite(slowParam) && slowParam > 1) setSlow(Math.min(8, slowParam));
    } catch {
      /* sessionStorage blocked — fall through and show. */
    }

    if (!show) {
      setActive(false);
      setLoaderDone(true); // let the hero animate immediately
    }
  }, []);

  /* Lock body scroll (and Lenis) while the loader covers the page. */
  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const lenis = (window as unknown as { lenis?: { stop?: () => void; start?: () => void } }).lenis;
    lenis?.stop?.();
    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start?.();
    };
  }, [active]);

  /* Phase state machine. */
  useEffect(() => {
    if (!active) return;

    if (phase === 'hold') {
      // Brief beat at 100 while the brand stack fades, then part the curtains.
      const t = setTimeout(() => setPhase('exit'), HOLD_MS * slow);
      return () => clearTimeout(t);
    }

    if (phase === 'exit') {
      const wipe = WIPE_MS * slow;
      // Phase 4: reveal the hero partway through the wipe.
      const revealAt = setTimeout(() => setLoaderDone(true), wipe * REVEAL_RATIO);
      // Unmount once both panels have finished parting.
      const finishAt = setTimeout(() => {
        setLoaderDone(true);
        setActive(false);
        onComplete?.();
      }, wipe + WIPE_STAGGER_MS * slow + 40);
      return () => {
        clearTimeout(revealAt);
        clearTimeout(finishAt);
      };
    }
  }, [phase, active, onComplete, slow]);

  const handleCountComplete = useCallback(() => {
    setPhase((p) => (p === 'enter' ? 'hold' : p));
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="ht-loader"
          aria-hidden="true"
          initial={false}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            backgroundColor: phase === 'exit' ? 'transparent' : 'var(--clr-void)',
            overflow: 'hidden',
            // Stop intercepting input as soon as the reveal begins.
            pointerEvents: phase === 'exit' ? 'none' : 'auto',
          }}
        >
          <Panels exiting={phase === 'exit'} reduceMotion={reduceMotion} wipeSec={wipeMs / 1000} />

          {/* Content layer — z 10000, above the panels (z 9999). */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(20px, 4vw, 56px)',
            }}
          >
            <LoaderContent fading={phase !== 'enter'} reduceMotion={reduceMotion}>
              <Counter durationMs={countMs} reduceMotion={reduceMotion} onComplete={handleCountComplete} />
            </LoaderContent>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
