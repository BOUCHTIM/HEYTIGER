'use client';

/**
 * MenuGrid — Japanese Fan (扇子 / Sensu) menu preview
 *
 * Motion approach: Framer Motion spring physics
 * - Shared pivot point at blade bottoms (transform-origin: bottom center)
 * - Left-to-right stagger (100ms per blade) mimics flicking a fan open
 * - Spring stiffness 58 / damping 11 / mass 0.8 → 2-3° natural overshoot + settle
 * - Hover: stiffer spring (150/18) for tactile response, blade lifts ~14% toward centre
 * - Other blades dim to 42% opacity on any-active state
 * - AnimatePresence cross-fades the detail panel between chapters
 * - Reduced-motion: static 3×2 card grid, no animation
 */

import { useRef, useState } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from 'framer-motion';
import Link from 'next/link';

/* ─── chapter data ──────────────────────────────────────────── */
const CHAPTERS = [
  {
    num: '01', title: 'ROBATA',    jp: '炉端焼き', sub: 'Binchotan Fire',
    dishes: ['A5 Wagyu Skewer', 'Miso Black Cod', 'Tiger Bone Marrow'],
    price: 'From AED 65',  slug: 'robata',
    bg: 'linear-gradient(175deg,#401C0C 0%,#1A0806 100%)',
  },
  {
    num: '02', title: 'IZAKAYA',   jp: '居酒屋',   sub: 'Share the Table',
    dishes: ['Wagyu Gyoza', 'Truffle Karaage', 'Crispy Rice Stack'],
    price: 'From AED 65',  slug: 'izakaya',
    bg: 'linear-gradient(175deg,#3A1A0A 0%,#170705 100%)',
  },
  {
    num: '03', title: 'SUSHI BAR', jp: '鮨バー',   sub: 'Ocean-First',
    dishes: ['Omakase Nigiri', 'RAAAAAR Roll', 'Toro Tartare'],
    price: 'From AED 110', slug: 'sushi-bar',
    bg: 'linear-gradient(175deg,#361809 0%,#150604 100%)',
  },
  {
    num: '04', title: 'RAMEN',     jp: '拉麺',     sub: 'Late-Night Craving',
    dishes: ['Tiger Broth', 'Red Dragon', 'Cold Tiger'],
    price: 'AED 145 — 185', slug: 'ramen',
    bg: 'linear-gradient(175deg,#361809 0%,#150604 100%)',
  },
  {
    num: '05', title: 'COCKTAILS', jp: 'カクテル', sub: '47 Sake Labels',
    dishes: ['Tokyo Negroni', 'The Cage', 'RAAAAAR'],
    price: 'AED 130 — 180', slug: 'cocktails',
    bg: 'linear-gradient(175deg,#3A1A0A 0%,#170705 100%)',
  },
  {
    num: '06', title: 'DESSERTS',  jp: '甘味',     sub: 'No Portion Control',
    dishes: ['Miso Lava Cake', 'Black Sesame Parfait', 'Yuzu Cheesecake'],
    price: 'AED 75 — 95',  slug: 'desserts',
    bg: 'linear-gradient(175deg,#401C0C 0%,#1A0806 100%)',
  },
] as const;

type Chapter = (typeof CHAPTERS)[number];

/* ─── fan geometry ──────────────────────────────────────────── */
// Total arc: 110° symmetric (-55° … +55°) from vertical
const FINAL_ANGLES  = [-55, -33, -11, 11, 33, 55] as const;
// Stagger delays: left → right (like flicking a fan open with the right hand)
const DELAYS        = [0, 0.10, 0.20, 0.30, 0.40, 0.50] as const;

const BW = 182;   // blade width  (px)
const BH = 428;   // blade height (px) — pivot at bottom centre

// Trapezoid clip-path: full width at top, pinched to 26 px at pivot
const BLADE_CLIP = `polygon(0% 0%, 100% 0%, calc(50% + 13px) 100%, calc(50% - 13px) 100%)`;

/* ─── sub-components ─────────────────────────────────────────── */

/** Single lacquered fan blade */
function FanBlade({
  chapter,
  index,
  inView,
  isActive,
  anyActive,
  onEnter,
  onLeave,
}: {
  chapter: Chapter;
  index: number;
  inView: boolean;
  isActive: boolean;
  anyActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const angle  = FINAL_ANGLES[index];
  // Active blade lifts 14% toward centre — subtle but perceptible
  const target = isActive ? angle * 0.86 : angle;

  return (
    <motion.div
      style={{
        position:        'absolute',
        bottom:          0,
        left:            `calc(50% - ${BW / 2}px)`,
        width:           BW,
        height:          BH,
        transformOrigin: 'bottom center',
        clipPath:        BLADE_CLIP,
        zIndex:          isActive ? 20 : index + 1,
        cursor:          'pointer',
        // Lacquered panel finish
        background:      chapter.bg,
        // drop-shadow follows clip-path shape — casts depth onto blade behind
        filter:          `drop-shadow(-3px 0 14px rgba(5,2,1,0.68))`,
      }}
      initial={{ rotate: 0, opacity: 0 }}
      animate={{
        rotate:  inView ? target : 0,
        opacity: inView ? (anyActive && !isActive ? 0.42 : 1) : 0,
      }}
      transition={{
        rotate: {
          type:      'spring',
          stiffness: isActive ? 150 : 58,
          damping:   isActive ? 18  : 11,
          mass:      0.8,
          // Only use stagger on the initial fan-open; not on hover transitions
          delay:     anyActive ? 0 : (inView ? DELAYS[index] : 0),
        },
        opacity: {
          duration: 0.3,
          delay:    anyActive ? 0 : (inView ? DELAYS[index] + 0.15 : 0),
        },
      }}
      onHoverStart={onEnter}
      onHoverEnd={onLeave}
    >
      {/* Accessible link — entire blade is the click target */}
      <Link
        href={`/menu#${chapter.slug}`}
        aria-label={`Chapter ${chapter.num}: ${chapter.title} — ${chapter.sub}`}
        style={{
          display:        'block',
          width:          '100%',
          height:         '100%',
          position:       'relative',
          textDecoration: 'none',
          outline:        'none',
        }}
        onFocus={onEnter}
        onBlur={onLeave}
      >
        {/* Brass / gold edge shimmer — brighter against cooler bg */}
        <div
          aria-hidden="true"
          style={{
            position:   'absolute',
            inset:       0,
            background: 'linear-gradient(to right, rgba(210,168,60,0.28) 0px, transparent 12px, transparent calc(100% - 12px), rgba(210,168,60,0.28) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Lacquer sheen — bright hairline highlight at blade tip */}
        <div
          aria-hidden="true"
          style={{
            position:   'absolute',
            top: 0, left: '8%', right: '8%',
            height:     '1px',
            background: `linear-gradient(to right, transparent, rgba(225,182,72,${isActive ? 0.85 : 0.62}), transparent)`,
            transition: 'background 0.25s ease',
            pointerEvents: 'none',
          }}
        />

        {/* Ghost chapter number — texture layer, bottom half */}
        <div
          aria-hidden="true"
          style={{
            position:    'absolute',
            bottom:      '6%',
            left:        '50%',
            transform:   'translateX(-50%)',
            fontFamily:  'var(--font-display)',
            fontWeight:   900,
            fontSize:    `${Math.round(BW * 0.68)}px`,
            lineHeight:   1,
            color:       `rgba(200,61,32,${isActive ? 0.11 : 0.07})`,
            letterSpacing: '-0.04em',
            userSelect:  'none',
            pointerEvents: 'none',
            whiteSpace:  'nowrap',
            transition:  'color 0.3s ease',
          }}
        >
          {chapter.num}
        </div>

        {/* Vertical content column — JP + chapter number */}
        <div
          style={{
            position:      'absolute',
            top:            '10%',
            bottom:         '20%',
            left:           '50%',
            transform:      'translateX(-50%)',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:             6,
            pointerEvents:  'none',
          }}
        >
          {/* Japanese characters — vertical writing */}
          <span
            lang="ja"
            style={{
              fontFamily:      'var(--font-jp)',
              fontSize:         13,
              fontWeight:       700,
              color:           `rgba(200,61,32,${isActive ? 0.95 : 0.5})`,
              writingMode:     'vertical-rl',
              textOrientation: 'mixed',
              letterSpacing:   '0.08em',
              lineHeight:       1.3,
              transition:      'color 0.25s ease',
            }}
          >
            {chapter.jp}
          </span>

          {/* Brass divider */}
          <div
            aria-hidden="true"
            style={{
              width:      1,
              height:     20,
              flexShrink: 0,
              background: `rgba(212,162,48,${isActive ? 0.70 : 0.24})`,
              transition: 'background 0.25s ease',
            }}
          />

          {/* Chapter number label */}
          <span
            style={{
              fontFamily:      'var(--font-body)',
              fontSize:         9,
              fontWeight:       900,
              letterSpacing:   '0.38em',
              color:           `rgba(200,61,32,${isActive ? 0.9 : 0.4})`,
              writingMode:     'vertical-rl',
              textOrientation: 'mixed',
              transition:      'color 0.25s ease',
            }}
          >
            {chapter.num}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/** Chapter detail panel — cross-fades above the fan */
function ChapterDetail({ chapter }: { chapter: Chapter }) {
  return (
    <motion.div
      key={chapter.num}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.3, 1] }}
      style={{ textAlign: 'center' }}
    >
      {/* Eyebrow */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:             12,
          marginBottom:    12,
        }}
      >
        <span
          style={{
            fontFamily:    'var(--font-body)',
            fontSize:       10,
            fontWeight:     900,
            letterSpacing: '0.44em',
            color:         'var(--clr-red)',
            textTransform: 'uppercase',
          }}
        >
          {chapter.num}
        </span>
        <span style={{ width: 28, height: 1, background: 'rgba(200,61,32,0.35)', display:'block', flexShrink:0 }} />
        <span
          style={{
            fontFamily:    'var(--font-body)',
            fontSize:       10,
            fontWeight:     700,
            letterSpacing: '0.24em',
            color:         'rgba(240,235,216,0.36)',
            textTransform: 'uppercase',
          }}
        >
          {chapter.sub}
        </span>
      </div>

      {/* Title + JP */}
      <div
        style={{
          display:        'flex',
          alignItems:     'baseline',
          justifyContent: 'center',
          gap:            'clamp(8px,1.5vw,18px)',
          flexWrap:       'wrap',
          marginBottom:    14,
        }}
      >
        <h3
          style={{
            margin:        0,
            fontFamily:    'var(--font-display)',
            fontWeight:     900,
            fontSize:      'clamp(32px,4.2vw,60px)',
            letterSpacing: '-0.025em',
            lineHeight:     1,
            color:         'var(--clr-cream)',
            textTransform: 'uppercase',
          }}
        >
          {chapter.title}
        </h3>
        <span
          lang="ja"
          style={{
            fontFamily:  'var(--font-jp)',
            fontSize:    'clamp(13px,1.7vw,20px)',
            fontWeight:   700,
            color:       'var(--clr-red)',
            opacity:      0.9,
            letterSpacing:'0.1em',
          }}
        >
          {chapter.jp}
        </span>
      </div>

      {/* Signature dishes */}
      <div
        style={{
          display:        'flex',
          justifyContent: 'center',
          gap:            'clamp(14px,2.5vw,32px)',
          flexWrap:       'wrap',
          marginBottom:    10,
        }}
      >
        {chapter.dishes.map(d => (
          <span
            key={d}
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:      'clamp(10px,0.9vw,12px)',
              letterSpacing: '0.16em',
              color:         'rgba(240,235,216,0.56)',
              textTransform: 'uppercase',
            }}
          >
            {d}
          </span>
        ))}
      </div>

      {/* Price cue */}
      <span
        style={{
          fontFamily:    'var(--font-body)',
          fontSize:       10,
          fontWeight:     700,
          letterSpacing: '0.24em',
          color:         'rgba(240,235,216,0.26)',
          textTransform: 'uppercase',
        }}
      >
        {chapter.price}
      </span>
    </motion.div>
  );
}

/** Reduced-motion fallback — accessible static grid */
function StaticGrid() {
  return (
    <div>
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap:                  '1px',
          background:          'rgba(240,235,216,0.07)',
          border:              '1px solid rgba(240,235,216,0.07)',
        }}
      >
        {CHAPTERS.map(ch => (
          <Link
            key={ch.num}
            href={`/menu#${ch.slug}`}
            style={{
              display:        'flex',
              flexDirection:  'column',
              padding:        'clamp(28px,4vw,44px) clamp(24px,3.5vw,36px)',
              background:      ch.bg,
              textDecoration: 'none',
              gap:             12,
            }}
          >
            <span
              style={{
                fontFamily:    'var(--font-body)',
                fontSize:       10,
                fontWeight:     900,
                letterSpacing: '0.4em',
                color:         'var(--clr-red)',
                textTransform: 'uppercase',
              }}
            >
              {ch.num}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily:    'var(--font-display)',
                  fontWeight:     900,
                  fontSize:      'clamp(22px,2.4vw,32px)',
                  letterSpacing: '-0.02em',
                  color:         'var(--clr-cream)',
                  textTransform: 'uppercase',
                }}
              >
                {ch.title}
              </span>
              <span
                lang="ja"
                style={{
                  fontFamily:  'var(--font-jp)',
                  fontSize:     14,
                  fontWeight:   700,
                  color:       'var(--clr-red)',
                  opacity:      0.85,
                }}
              >
                {ch.jp}
              </span>
            </div>
            <span
              style={{
                fontFamily:    'var(--font-body)',
                fontSize:      'clamp(11px,1vw,13px)',
                letterSpacing: '0.04em',
                color:         'rgba(240,235,216,0.5)',
                lineHeight:     1.55,
              }}
            >
              {ch.dishes.join(' · ')}
            </span>
            <span
              style={{
                fontFamily:    'var(--font-body)',
                fontSize:       10,
                fontWeight:     700,
                letterSpacing: '0.22em',
                color:         'rgba(240,235,216,0.26)',
                textTransform: 'uppercase',
                marginTop:      4,
              }}
            >
              {ch.price}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── main export ────────────────────────────────────────────── */
export default function MenuGrid() {
  const sectionRef  = useRef<HTMLElement>(null);
  const inView      = useInView(sectionRef, { once: true, margin: '-8%' });
  const prefersLess = useReducedMotion();

  // Active chapter: null = no hover (shows first chapter as default)
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const displayChapter = CHAPTERS[activeIdx ?? 0];
  const anyActive      = activeIdx !== null;

  return (
    <section
      id="menu"
      ref={sectionRef}
      aria-label="Menu chapters"
      style={{
        background:    'var(--clr-void)',
        position:      'relative',
        borderTop:     '1px solid var(--border-structural)',
        paddingTop:    'clamp(72px,9vw,120px)',
        paddingBottom: 'clamp(72px,9vw,120px)',
        overflow:      'hidden',
      }}
    >
      {/* ── Ember stage light — single warm source at pivot, animates with fan ── */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.3, ease: 'easeOut' }}
        style={{
          position:      'absolute',
          inset:          0,
          pointerEvents: 'none',
          zIndex:         0,
          background:    `
            radial-gradient(ellipse 55% 38% at 50% 100%, rgba(190,90,20,0.30) 0%, transparent 60%),
            radial-gradient(ellipse 88% 56% at 50% 100%, rgba(150,55,10,0.14) 0%, transparent 70%)
          `,
        }}
      />

      {/* ── Section header ── */}
      <div
        style={{
          maxWidth:  '1320px',
          margin:    '0 auto',
          padding:   '0 clamp(20px,5vw,56px)',
          textAlign: 'center',
          marginBottom: 'clamp(40px,5vw,60px)',
          position:  'relative',
          zIndex:     2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 18 }}
        >
          <span
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:       10,
              fontWeight:     900,
              letterSpacing: '0.48em',
              color:         'var(--clr-red)',
              textTransform: 'uppercase',
            }}
          >
            THE MENU ·{' '}
            <span lang="ja" style={{ fontFamily: 'var(--font-jp)', letterSpacing: '0.2em' }}>
              料理
            </span>
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.3, 1] }}
          style={{
            margin:        0,
            fontFamily:    'var(--font-display)',
            fontWeight:     900,
            fontSize:      'clamp(40px,5.5vw,80px)',
            letterSpacing: '-0.03em',
            lineHeight:     0.94,
            color:         'var(--clr-cream)',
            textTransform: 'uppercase',
          }}
        >
          SIX CHAPTERS.{' '}
          <span style={{ color: 'var(--clr-red)' }}>ONE KITCHEN.</span>
        </motion.h2>
      </div>

      {/* ── Content ── */}
      {prefersLess ? (
        /* Reduced-motion: static grid */
        <div
          style={{
            maxWidth:  '1320px',
            margin:    '0 auto',
            padding:   '0 clamp(20px,5vw,56px)',
            position:  'relative',
            zIndex:     2,
          }}
        >
          <StaticGrid />
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <Link
              href="/menu"
              style={{
                display:       'inline-flex',
                alignItems:    'center',
                gap:            10,
                fontFamily:    'var(--font-body)',
                fontSize:       11,
                fontWeight:     900,
                letterSpacing: '0.38em',
                color:         'var(--clr-void)',
                background:    'var(--clr-red)',
                padding:       '14px 32px',
                textDecoration:'none',
                textTransform: 'uppercase',
              }}
            >
              VIEW FULL MENU{' '}
              <span style={{ fontSize: 15, lineHeight: '1' }}>→</span>
            </Link>
          </div>
        </div>
      ) : (
        /* ── Interactive fan ── */
        <>
          {/* ── Mobile (< 520px): static grid fallback ── */}
          <div className="ht-fan-sm" style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 clamp(20px,5vw,56px)' }}>
              <StaticGrid />
              <div style={{ marginTop: 40, textAlign: 'center' }}>
                <Link
                  href="/menu"
                  style={{
                    display:       'inline-flex',
                    alignItems:    'center',
                    gap:            10,
                    fontFamily:    'var(--font-body)',
                    fontSize:       11,
                    fontWeight:     900,
                    letterSpacing: '0.38em',
                    color:         'var(--clr-void)',
                    background:    'var(--clr-red)',
                    padding:       '14px 32px',
                    textDecoration:'none',
                    textTransform: 'uppercase',
                  }}
                >
                  VIEW FULL MENU <span style={{ fontSize: 15 }}>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ── Tablet + desktop (≥ 520px): interactive fan ── */}
          <div className="ht-fan-lg" style={{ position: 'relative', zIndex: 2 }}>
          {/* Detail panel — fixed-height container prevents layout shift */}
          <div
            aria-live="polite"
            aria-atomic="true"
            style={{
              position:       'relative',
              height:          160,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              padding:        '0 clamp(20px,5vw,56px)',
            }}
          >
            <AnimatePresence mode="wait">
              <ChapterDetail key={displayChapter.num} chapter={displayChapter} />
            </AnimatePresence>
          </div>

          {/* Invite hint — only shown before first interaction */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: anyActive ? 0 : 0.35 } : {}}
            transition={{ duration: 0.5, delay: 0.9 }}
            style={{
              textAlign:     'center',
              marginBottom:   12,
              fontFamily:    'var(--font-body)',
              fontSize:       9,
              fontWeight:     700,
              letterSpacing: '0.38em',
              color:         'rgba(240,235,216,0.6)',
              textTransform: 'uppercase',
              pointerEvents: 'none',
              userSelect:    'none',
            }}
          >
            ── HOVER A CHAPTER ──
          </motion.div>

          {/* Fan container */}
          <div
            id="ht-fan-stage"
            style={{
              position:       'relative',
              zIndex:          2,
              height:          BH + 24,
              width:          '100%',
              overflow:       'visible',
              display:        'flex',
              justifyContent: 'center',
            }}
          >
            {/* Fan blades */}
            {CHAPTERS.map((chapter, i) => (
              <FanBlade
                key={chapter.num}
                chapter={chapter}
                index={i}
                inView={inView}
                isActive={activeIdx === i}
                anyActive={anyActive}
                onEnter={() => setActiveIdx(i)}
                onLeave={() => setActiveIdx(null)}
              />
            ))}

            {/* Pivot rivet — the physical join point */}
            <div
              aria-hidden="true"
              style={{
                position:    'absolute',
                bottom:       0,
                left:        '50%',
                transform:   'translateX(-50%)',
                width:        16,
                height:       16,
                borderRadius: '50%',
                background:  'radial-gradient(circle at 35% 35%, #d4a844, #8a6420)',
                border:      '1px solid rgba(210,165,65,0.6)',
                boxShadow:   '0 0 12px rgba(200,130,40,0.4), inset 0 1px 2px rgba(255,220,120,0.3)',
                zIndex:       30,
              }}
            />
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.85 }}
            style={{ textAlign: 'center', marginTop: 'clamp(36px,5vw,56px)' }}
          >
            <Link
              href="/menu"
              style={{
                display:       'inline-flex',
                alignItems:    'center',
                gap:            10,
                fontFamily:    'var(--font-body)',
                fontSize:       11,
                fontWeight:     900,
                letterSpacing: '0.38em',
                color:         'var(--clr-void)',
                background:    'var(--clr-red)',
                padding:       '14px 36px',
                textDecoration:'none',
                textTransform: 'uppercase',
                transition:    'background 0.18s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--clr-red-dim)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--clr-red)'; }}
            >
              VIEW FULL MENU{' '}
              <span style={{ fontSize: 15, lineHeight: '1' }}>→</span>
            </Link>
          </motion.div>
          </div>{/* end .ht-fan-lg */}
        </>
      )}

      {/* ── Edge vignette — pulls eye to centre, pointer-events: none ── */}
      <div
        aria-hidden="true"
        style={{
          position:      'absolute',
          inset:          0,
          pointerEvents: 'none',
          zIndex:         50,
          background:    'radial-gradient(ellipse 80% 65% at 50% 50%, transparent 30%, rgba(5,3,2,0.48) 100%)',
        }}
      />

      {/* ── Responsive fan scaling ── */}
      <style>{`
        /* Default: show fan, hide static fallback */
        .ht-fan-sm { display: none; }
        .ht-fan-lg { display: block; }

        /* Mobile < 520px: show static grid, hide fan */
        @media (max-width: 519px) {
          .ht-fan-sm { display: block; }
          .ht-fan-lg { display: none; }
        }

        /* Tablet 520–900px: scale fan to 70%
           transform-origin: bottom center means the empty layout space
           is at the TOP of the stage div — pull it up with negative margin-top */
        @media (min-width: 520px) and (max-width: 900px) {
          #ht-fan-stage {
            transform: scale(0.70);
            transform-origin: bottom center;
            margin-top: -136px;
          }
        }

        /* ── Grain texture — SVG fractal noise at 3% overlay ──
           Adds subtle material depth without an external asset.
           z-index 55 keeps it above the vignette (50). */
        #menu::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          opacity: 0.032;
          mix-blend-mode: overlay;
          pointer-events: none;
          z-index: 55;
        }
      `}</style>
    </section>
  );
}
