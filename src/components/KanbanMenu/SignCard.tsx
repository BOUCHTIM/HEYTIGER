'use client';

import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import NailDetail from './NailDetail';
import type { SignData } from './signs';

/* custom payload for the variant functions */
type CardCustom = { rot: number; reduce: boolean; scale: number };

/* Depth tiers — front boards sit closer (tighter, darker shadow, slightly
   larger); back boards recede. This breaks the single-shadow-plane flatness. */
const TIER = {
  1: { shadow: '0 26px 54px rgba(0,0,0,0.66), inset 0 1px 0 rgba(255,255,255,0.08)', scale: 1.02, z: 12 },
  2: { shadow: '0 18px 44px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)', scale: 1.0, z: 11 },
  3: { shadow: '0 12px 28px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.06)', scale: 0.97, z: 10 },
} as const;

/* Chipped-corner clips — small diagonal notches that read as worn board edges. */
const WORN_CLIP = {
  tr: 'polygon(0 0, calc(100% - 16px) 0, 100% 13px, 100% 100%, 0 100%)',
  bl: 'polygon(0 0, 100% 0, 100% 100%, 17px 100%, 0 calc(100% - 14px))',
} as const;

/* Entrance + dim/hide states. Parent <container> orchestrates "hidden"→"show"
   with staggerChildren; selecting a card flips others to "dim", itself to "hide"
   (the expanded board takes over via the shared layoutId). */
const cardVariants: Variants = {
  hidden: (c: CardCustom) =>
    c.reduce ? { opacity: 0 } : { opacity: 0, y: -80, rotate: c.rot + (c.rot > 0 ? 20 : -20) },
  show: (c: CardCustom) => ({
    opacity: 1,
    y: 0,
    rotate: c.rot,
    scale: c.scale,
    transition: c.reduce ? { duration: 0.2 } : { type: 'spring', stiffness: 120, damping: 12 },
  }),
  dim: (c: CardCustom) => ({ opacity: 0.15, y: 0, rotate: c.rot, scale: c.scale, transition: { duration: 0.3 } }),
  hide: (c: CardCustom) => ({ opacity: 0, y: 0, rotate: c.rot, scale: c.scale, transition: { duration: 0.3 } }),
};

const mobileRot = (deg: number) => Math.max(-3, Math.min(3, deg)); // gentler wall on mobile

export default function SignCard({
  sign,
  isMobile,
  dimmed,
  hidden,
  reduceMotion,
  onSelect,
}: {
  sign: SignData;
  isMobile: boolean;
  dimmed: boolean;
  hidden: boolean;
  reduceMotion: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const rot = isMobile ? mobileRot(sign.rotation) : sign.rotation;
  const kanjiColor = sign.accent ?? sign.color;
  const tier = TIER[sign.tier];
  const custom: CardCustom = { rot, reduce: reduceMotion, scale: isMobile ? 1 : tier.scale };
  const animateState = hidden ? 'hide' : dimmed ? 'dim' : undefined; // undefined ⇒ inherit container "show"

  return (
    <motion.button
      type="button"
      aria-label={`${sign.en} — open menu`}
      onClick={onSelect}
      layoutId={`sign-${sign.id}`}
      variants={cardVariants}
      custom={custom}
      animate={animateState}
      whileHover={reduceMotion || hidden ? undefined : { scale: custom.scale + 0.03, rotate: rot - Math.sign(rot) * 2 }}
      whileTap={hidden ? undefined : { scale: 0.99 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: isMobile ? 'relative' : 'absolute',
        top: isMobile ? undefined : sign.top,
        left: isMobile ? undefined : sign.left,
        width: isMobile ? '100%' : sign.width,
        height: isMobile ? 'auto' : sign.height,
        minHeight: isMobile ? 168 : undefined,
        backgroundColor: sign.bg,
        color: sign.color,
        border: 0,
        borderRadius: 3,
        padding: 'clamp(18px, 2vw, 26px)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 16,
        textAlign: 'left',
        boxShadow: tier.shadow,
        zIndex: hidden ? 1 : tier.z,
        clipPath: sign.worn ? WORN_CLIP[sign.worn] : undefined,
        // aged boards sit duller — a whole-board darkening, text included (it's old)
        filter: sign.aged ? 'brightness(0.92) saturate(0.96)' : undefined,
        willChange: 'transform, opacity',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* paper-grain layer — SVG turbulence on a colour-only layer so text stays crisp */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 3,
          background: sign.bg,
          filter: 'url(#paper-texture)',
          opacity: 0.5,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {!isMobile && <NailDetail color={sign.accent ?? sign.color} />}

      {/* top — big kanji + reading */}
      <span style={{ display: 'block', position: 'relative', zIndex: 1 }}>
        <span
          lang="ja"
          style={{
            display: 'block',
            fontFamily: "var(--font-japanese-serif, 'Noto Serif JP', serif)",
            fontSize: sign.kanjiSize,
            fontWeight: 700,
            lineHeight: 1,
            color: kanjiColor,
          }}
        >
          {sign.kanji}
        </span>
        {sign.reading && (
          <span
            lang="ja"
            style={{
              display: 'block',
              marginTop: 8,
              fontFamily: "var(--font-japanese-serif, 'Noto Serif JP', serif)",
              fontSize: '0.72rem',
              letterSpacing: '0.22em',
              opacity: 0.66,
            }}
          >
            {sign.reading}
          </span>
        )}
      </span>

      {/* bottom — english name + sub + hover hint */}
      <span style={{ display: 'block', position: 'relative', zIndex: 1 }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
            fontWeight: 700,
            letterSpacing: '0.01em',
            lineHeight: 1.05,
          }}
        >
          {sign.en}
        </span>
        <span
          style={{
            display: 'block',
            marginTop: 7,
            fontFamily: 'var(--font-body)',
            fontSize: '0.6rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            opacity: 0.6,
          }}
        >
          {sign.sub}
        </span>
        <motion.span
          lang="ja"
          aria-hidden="true"
          animate={{ opacity: hovered && !hidden ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            display: 'block',
            marginTop: 9,
            fontFamily: "var(--font-japanese-serif, 'Noto Serif JP', serif)",
            fontSize: '0.62rem',
            letterSpacing: '0.14em',
            color: sign.color,
          }}
        >
          タップして開く
        </motion.span>
      </span>
    </motion.button>
  );
}
