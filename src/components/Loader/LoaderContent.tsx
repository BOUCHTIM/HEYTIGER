'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

/** Soft cinematic ease for the brand reveals. */
const EASE_IN: [number, number, number, number] = [0.22, 1, 0.36, 1];

const JP_CHARS = ['お', 'い', 'ト', 'ラ'];
const TAGLINE = 'RAAAAAAR CULTURE · MOTOR CITY DUBAI';

interface LoaderContentProps {
  /** Phase 2 — once true, the whole brand stack (incl. counter) fades to 0. */
  fading: boolean;
  reduceMotion?: boolean;
  /** The counter is slotted into the middle of the stack. */
  children?: ReactNode;
}

/**
 * The brand reveal that plays over the solid cover (Phase 1), then fades as a
 * unit while the background stays put (Phase 2). Reveal timings match the brief:
 * logo @400ms, おいトラ char-clip @700ms (60ms stagger), tagline @900ms.
 */
export default function LoaderContent({ fading, reduceMotion = false, children }: LoaderContentProps) {
  return (
    <motion.div
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(16px, 2.6vw, 32px)',
        textAlign: 'center',
      }}
    >
      {/* Logo — @400ms: scale 0.85 → 1, opacity 0 → 1 */}
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: reduceMotion ? 0 : 0.4, ease: EASE_IN }}
        style={{ lineHeight: 0 }}
      >
        <Image
          src="/heytiger-logo.png"
          alt="Hey Tiger"
          width={300}
          height={281}
          priority
          unoptimized
          style={{
            width: 'clamp(140px, 16vw, 230px)',
            height: 'auto',
            // Force pure white regardless of the source asset's colour.
            filter: 'brightness(0) invert(1)',
          }}
        />
      </motion.div>

      {/* Counter slot (Phase 1 progress) */}
      <div style={{ lineHeight: 0 }}>{children}</div>

      {/* おいトラ — @700ms: each char clips up from below, staggered 60ms */}
      <div lang="ja" aria-label="おいトラ" style={{ display: 'flex', gap: '0.04em' }}>
        {JP_CHARS.map((char, i) => (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', lineHeight: 1 }}>
            <motion.span
              initial={reduceMotion ? { opacity: 0 } : { y: '110%' }}
              animate={reduceMotion ? { opacity: 1 } : { y: '0%' }}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.7 + i * 0.06, ease: EASE_IN }}
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-jp-rough)',
                fontSize: 'clamp(26px, 4.4vw, 60px)',
                color: 'var(--clr-cream)',
              }}
            >
              {char}
            </motion.span>
          </span>
        ))}
      </div>

      {/* Tagline — @900ms: slides in from the left */}
      <motion.p
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: reduceMotion ? 0 : 0.9, ease: EASE_IN }}
        style={{
          margin: 0,
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(10px, 1.1vw, 13px)',
          fontWeight: 800,
          letterSpacing: '0.34em',
          textTransform: 'uppercase',
          color: 'var(--amber-wood)',
        }}
      >
        {TAGLINE}
      </motion.p>
    </motion.div>
  );
}
