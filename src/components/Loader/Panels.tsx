'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

/** Sharp luxury ease for the curtain wipe. */
const WIPE_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

interface PanelsProps {
  /** Phase 3 trigger — once true, both panels wipe away. */
  exiting: boolean;
  reduceMotion?: boolean;
  /** Per-panel wipe duration in seconds (overridable for QA slow-mo). */
  wipeSec?: number;
}

/**
 * Phase 3 — the curtain reveal.
 *
 * Two solid panels (each ~half width) make up the SOLID cover during Phases 1–2,
 * which is the fix for the old transparent-panel bleed-through. On exit they
 * scaleX → 0 from their OUTER edges (left panel pinned left, right panel pinned
 * right), so the screen parts from the centre outward like stage curtains. The
 * right panel trails the left by 80ms for an asymmetric, choreographed wipe.
 */
export default function Panels({ exiting, reduceMotion = false, wipeSec = 0.8 }: PanelsProps) {
  const duration = reduceMotion ? 0.25 : wipeSec;

  const base = {
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    // 1px overlap at the centre line prevents any sub-pixel seam during cover.
    width: 'calc(50% + 1px)',
    backgroundColor: 'var(--clr-void)',
    zIndex: 9999,
    willChange: 'transform',
  };

  const leftVariants: Variants = {
    cover: { scaleX: 1 },
    open: { scaleX: 0, transition: { duration, ease: WIPE_EASE } },
  };
  const rightVariants: Variants = {
    cover: { scaleX: 1 },
    open: { scaleX: 0, transition: { duration, ease: WIPE_EASE, delay: reduceMotion ? 0 : 0.08 } },
  };

  const state = exiting ? 'open' : 'cover';

  return (
    <>
      <motion.div
        aria-hidden="true"
        variants={leftVariants}
        initial="cover"
        animate={state}
        style={{ ...base, left: 0, transformOrigin: 'left center' }}
      />
      <motion.div
        aria-hidden="true"
        variants={rightVariants}
        initial="cover"
        animate={state}
        style={{ ...base, right: 0, transformOrigin: 'right center' }}
      />
    </>
  );
}
