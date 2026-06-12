'use client';

import { motion, type Variants } from 'framer-motion';
import { TOKENS } from './signs';

/**
 * Stickers — five accumulated wall stamps/badges (pure CSS/SVG, no images) that
 * add noise and character. Config lives in STICKERS; each pops/fades in on its
 * own delay. On mobile only the ambient "本日のおすすめ" stamp (s4) remains.
 */

type Entrance = 'pop' | 'fade' | 'seal';

interface StickerCfg {
  id: 's1' | 's2' | 's3' | 's4' | 's5';
  top: string;
  left: string;
  rotate: number;
  delay: number;
  entrance: Entrance;
  mobile: boolean; // visible on mobile?
}

const STICKERS: StickerCfg[] = [
  { id: 's1', top: '4%', left: '93%', rotate: 14, delay: 0.6, entrance: 'pop', mobile: false },
  { id: 's2', top: '46%', left: '21%', rotate: -8, delay: 0.8, entrance: 'pop', mobile: false },
  { id: 's3', top: '44%', left: '57%', rotate: 6, delay: 1.0, entrance: 'pop', mobile: false },
  { id: 's4', top: '90%', left: '85%', rotate: -5, delay: 1.2, entrance: 'fade', mobile: true },
  { id: 's5', top: '64%', left: '93%', rotate: 22, delay: 1.4, entrance: 'seal', mobile: false },
];

const POP = { type: 'spring', stiffness: 200, damping: 11 } as const;

/* entrance variants keyed by kind; `c` carries the resting rotation */
const variants: Record<Entrance, Variants> = {
  pop: {
    hidden: { scale: 0, opacity: 0 },
    show: (c: number) => ({ scale: 1, opacity: 1, rotate: c, transition: { ...POP } }),
  },
  fade: {
    hidden: { opacity: 0 },
    show: (c: number) => ({ opacity: 0.45, rotate: c, transition: { duration: 0.6 } }),
  },
  seal: {
    hidden: { opacity: 0, rotate: -180 },
    show: (c: number) => ({ opacity: 1, rotate: c, transition: { duration: 0.8, ease: 'easeOut' } }),
  },
};

export default function Stickers({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      {STICKERS.filter((s) => !isMobile || s.mobile).map((s) => (
        <motion.div
          key={s.id}
          aria-hidden="true"
          custom={s.rotate}
          variants={variants[s.entrance]}
          initial="hidden"
          animate="show"
          transition={{ delay: s.delay }}
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            zIndex: 4, // above bg, below cards
            pointerEvents: 'none',
            transformOrigin: 'center',
          }}
        >
          <StickerInner id={s.id} />
        </motion.div>
      ))}
    </>
  );
}

function StickerInner({ id }: { id: StickerCfg['id'] }) {
  const center = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } as const;
  const jpFont = "var(--font-japanese-serif, 'Noto Serif JP', serif)";

  if (id === 's1') {
    // orange circle stamp · 虎
    return (
      <span
        lang="ja"
        style={{
          ...center,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: TOKENS.orange,
          border: `2px solid ${TOKENS.gold}`,
          color: '#fff',
          fontFamily: jpFont,
          fontSize: '1.4rem',
        }}
      >
        虎
      </span>
    );
  }
  if (id === 's2') {
    // red rectangle badge · 営業中 / OPEN NOW
    return (
      <span
        lang="ja"
        style={{
          ...center,
          width: 68,
          height: 28,
          borderRadius: 3,
          background: TOKENS.red,
          color: TOKENS.cream,
          lineHeight: 1.1,
        }}
      >
        <span style={{ fontFamily: jpFont, fontSize: '0.6rem', letterSpacing: '0.1em' }}>営業中</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.45rem', letterSpacing: '0.18em' }}>OPEN NOW</span>
      </span>
    );
  }
  if (id === 's3') {
    // cream oval · 2AM / CLOSE
    return (
      <span
        style={{
          ...center,
          width: 80,
          height: 40,
          borderRadius: '50%',
          background: TOKENS.cream,
          border: `1.5px solid ${TOKENS.kraft}`,
          lineHeight: 1,
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: TOKENS.red }}>2AM</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.4rem', letterSpacing: '0.16em', color: TOKENS.void }}>CLOSE</span>
      </span>
    );
  }
  if (id === 's4') {
    // dark worn vertical · 本日のおすすめ
    return (
      <span
        lang="ja"
        style={{
          ...center,
          width: 34,
          height: 90,
          borderRadius: 2,
          background: TOKENS.dark,
          border: '1px solid rgba(200,169,110,0.3)',
          writingMode: 'vertical-rl',
          fontFamily: jpFont,
          fontSize: '0.55rem',
          letterSpacing: '0.1em',
          color: 'rgba(200,169,110,0.5)',
          padding: '6px 0',
        }}
      >
        本日のおすすめ
      </span>
    );
  }
  // s5 — circular seal with arc text
  return (
    <svg width="58" height="58" viewBox="0 0 58 58" aria-hidden="true">
      <defs>
        <path id="seal-arc" d="M29,29 m-21,0 a21,21 0 1,1 42,0 a21,21 0 1,1 -42,0" fill="none" />
      </defs>
      <circle cx="29" cy="29" r="27.5" fill="none" stroke={TOKENS.orange} strokeWidth="2.5" />
      <text fill={TOKENS.orange} fontSize="5" letterSpacing="0.5" style={{ fontFamily: 'var(--font-body)' }}>
        <textPath href="#seal-arc" startOffset="0">
          HEY TIGER · おいトラ · DUBAI ·
        </textPath>
      </text>
      <text x="29" y="32" textAnchor="middle" fontSize="9" fontWeight="700" fill={TOKENS.orange} style={{ fontFamily: 'var(--font-display)' }}>
        2025
      </text>
    </svg>
  );
}
