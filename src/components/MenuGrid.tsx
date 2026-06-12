'use client';

/**
 * MenuGrid — Japanese Fan (扇子 / Sensu) menu preview
 *
 * Motion approach: Framer Motion spring physics
 * - Shared pivot point at blade bottoms (transform-origin: bottom center)
 * - Left-to-right stagger (100ms per blade) mimics flicking a fan open
 * - Responsive geometry for mobile/tablet/desktop
 * - Mobile: touch-optimized, smaller dimensions, reduced spread
 */

import { useRef, useState, useEffect } from 'react';
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

/* ─── responsive geometry hooks ─────────────────────────────── */
function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateBreakpoint = () => {
      if (window.innerWidth < 520) setBreakpoint('mobile');
      else if (window.innerWidth < 900) setBreakpoint('tablet');
      else setBreakpoint('desktop');
    };
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

/* ─── responsive fan geometry ───────────────────────────────── */
function getFanGeometry(breakpoint: 'mobile' | 'tablet' | 'desktop') {
  let BW, BH, FINAL_ANGLES, pivotPinch;
  
  if (breakpoint === 'mobile') {
    BW = 110;
    BH = 280;
    FINAL_ANGLES = [-30, -18, -6, 6, 18, 30];
    pivotPinch = 18;
  } else if (breakpoint === 'tablet') {
    BW = 140;
    BH = 360;
    FINAL_ANGLES = [-45, -27, -9, 9, 27, 45];
    pivotPinch = 22;
  } else {
    BW = 182;
    BH = 428;
    FINAL_ANGLES = [-55, -33, -11, 11, 33, 55];
    pivotPinch = 26;
  }

  return {
    BW, // blade width
    BH, // blade height
    FINAL_ANGLES: FINAL_ANGLES as readonly number[],
    BLADE_CLIP: `polygon(0% 0%, 100% 0%, calc(50% + ${pivotPinch/2}px) 100%, calc(50% - ${pivotPinch/2}px) 100%)`,
  };
}

const DELAYS = [0, 0.10, 0.20, 0.30, 0.40, 0.50] as const;

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
  geometry,
  breakpoint,
}: {
  chapter: Chapter;
  index: number;
  inView: boolean;
  isActive: boolean;
  anyActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  geometry: ReturnType<typeof getFanGeometry>;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
}) {
  const { BW, BH, FINAL_ANGLES, BLADE_CLIP } = geometry;
  const angle = FINAL_ANGLES[index];
  const target = isActive ? angle * 0.86 : angle;
  const fontSizeScale = breakpoint === 'mobile' ? 0.75 : breakpoint === 'tablet' ? 0.85 : 1;

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
        background:      chapter.bg,
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
          delay:     anyActive ? 0 : (inView ? DELAYS[index] : 0),
        },
        opacity: {
          duration: 0.3,
          delay:    anyActive ? 0 : (inView ? DELAYS[index] + 0.15 : 0),
        },
      }}
      onHoverStart={onEnter}
      onHoverEnd={onLeave}
      onTouchStart={onEnter}
      onTouchEnd={onLeave}
    >
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
        <div
          aria-hidden="true"
          style={{
            position:   'absolute',
            inset:       0,
            background: 'linear-gradient(to right, rgba(210,168,60,0.28) 0px, transparent 12px, transparent calc(100% - 12px), rgba(210,168,60,0.28) 100%)',
            pointerEvents: 'none',
          }}
        />
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
          <span
            lang="ja"
            style={{
              fontFamily:      'var(--font-jp)',
              fontSize:         13 * fontSizeScale,
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
          <div
            aria-hidden="true"
            style={{
              width:      1,
              height:     20 * fontSizeScale,
              flexShrink: 0,
              background: `rgba(212,162,48,${isActive ? 0.70 : 0.24})`,
              transition: 'background 0.25s ease',
            }}
          />
          <span
            style={{
              fontFamily:      'var(--font-body)',
              fontSize:         9 * fontSizeScale,
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
  const breakpoint  = useBreakpoint();
  const geometry    = getFanGeometry(breakpoint);

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const displayChapter = CHAPTERS[activeIdx ?? 0];
  const anyActive      = activeIdx !== null;

  // Adjust margin for tablet scaling
  const getStageStyle = () => {
    if (breakpoint === 'tablet') {
      return {
        transform: 'scale(1)',
        transformOrigin: 'bottom center',
        marginTop: 0,
      };
    }
    return {};
  };

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
      {prefersLess ? (
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
        <>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div
              aria-live="polite"
              aria-atomic="true"
              style={{
                position:       'relative',
                minHeight:       160,
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
              {breakpoint === 'mobile' ? '── TAP A CHAPTER ──' : '── HOVER A CHAPTER ──'}
            </motion.div>
            <div
              id="ht-fan-stage"
              style={{
                position:       'relative',
                zIndex:          2,
                height:          geometry.BH + 24,
                width:          '100%',
                overflow:       'visible',
                display:        'flex',
                justifyContent: 'center',
                ...getStageStyle(),
              }}
            >
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
                  geometry={geometry}
                  breakpoint={breakpoint}
                />
              ))}
              <div
                aria-hidden="true"
                style={{
                  position:    'absolute',
                  bottom:       0,
                  left:        '50%',
                  transform:   'translateX(-50%)',
                  width:        breakpoint === 'mobile' ? 14 : breakpoint === 'tablet' ? 15 : 16,
                  height:       breakpoint === 'mobile' ? 14 : breakpoint === 'tablet' ? 15 : 16,
                  borderRadius: '50%',
                  background:  'radial-gradient(circle at 35% 35%, #d4a844, #8a6420)',
                  border:      '1px solid rgba(210,165,65,0.6)',
                  boxShadow:   '0 0 12px rgba(200,130,40,0.4), inset 0 1px 2px rgba(255,220,120,0.3)',
                  zIndex:       30,
                }}
              />
            </div>
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
          </div>
        </>
      )}
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
      <style>{`
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
