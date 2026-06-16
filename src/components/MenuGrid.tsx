'use client';

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
    bg: 'linear-gradient(175deg,#5A2411 0%,#230B06 100%)',
  },
  {
    num: '02', title: 'IZAKAYA',   jp: '居酒屋',   sub: 'Share the Table',
    dishes: ['Wagyu Gyoza', 'Truffle Karaage', 'Crispy Rice Stack'],
    price: 'From AED 65',  slug: 'izakaya',
    bg: 'linear-gradient(175deg,#52220F 0%,#200905 100%)',
  },
  {
    num: '03', title: 'SUSHI BAR', jp: '鮨バー',   sub: 'Ocean-First',
    dishes: ['Omakase Nigiri', 'RAAAAAR Roll', 'Toro Tartare'],
    price: 'From AED 110', slug: 'sushi-bar',
    bg: 'linear-gradient(175deg,#4D200D 0%,#1D0804 100%)',
  },
  {
    num: '04', title: 'RAMEN',     jp: '拉麺',     sub: 'Late-Night Craving',
    dishes: ['Tiger Broth', 'Red Dragon', 'Cold Tiger'],
    price: 'AED 145 – 185', slug: 'ramen',
    bg: 'linear-gradient(175deg,#4D200D 0%,#1D0804 100%)',
  },
  {
    num: '05', title: 'COCKTAILS', jp: 'カクテル', sub: '47 Sake Labels',
    dishes: ['Tokyo Negroni', 'The Cage', 'RAAAAAR'],
    price: 'AED 130 – 180', slug: 'cocktails',
    bg: 'linear-gradient(175deg,#52220F 0%,#200905 100%)',
  },
  {
    num: '06', title: 'DESSERTS',  jp: '甘味',     sub: 'No Portion Control',
    dishes: ['Miso Lava Cake', 'Black Sesame Parfait', 'Yuzu Cheesecake'],
    price: 'AED 75 – 95',  slug: 'desserts',
    bg: 'linear-gradient(175deg,#5A2411 0%,#230B06 100%)',
  },
  {
    num: '07', title: 'BRUNCH',    jp: '朝食',     sub: 'Sat & Sun · 11AM–4PM',
    dishes: ['Matcha Pancakes', 'Chirashi Bowl', 'Wagyu Benedict'],
    price: 'From AED 68',  slug: 'brunch',
    bg: 'linear-gradient(175deg,#3D2514 0%,#1A0C05 100%)',
  },
] as const;

type Chapter = (typeof CHAPTERS)[number];

/* ─── responsive hooks ──────────────────────────────────────────── */
function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('xl');
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const update = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
      setWindowWidth(w);
      if (w < 390) setBreakpoint('xs');
      else if (w < 430) setBreakpoint('sm');
      else if (w < 480) setBreakpoint('md');
      else if (w < 768) setBreakpoint('lg');
      else setBreakpoint('xl');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return { breakpoint, windowWidth };
}

function useGeometry(breakpoint: string, windowWidth: number) {
  let bladeWidth, bladeHeight, spreadAngle, pivotPinch;

  if (breakpoint === 'xs') {
    bladeWidth = Math.min(windowWidth * 0.30, 110);
    bladeHeight = Math.min(windowWidth * 0.72, 260);
    spreadAngle = 58;
    pivotPinch = 18;
  } else if (breakpoint === 'sm') {
    bladeWidth = Math.min(windowWidth * 0.28, 120);
    bladeHeight = Math.min(windowWidth * 0.68, 280);
    spreadAngle = 62;
    pivotPinch = 20;
  } else if (breakpoint === 'md') {
    bladeWidth = Math.min(windowWidth * 0.26, 130);
    bladeHeight = Math.min(windowWidth * 0.64, 300);
    spreadAngle = 64;
    pivotPinch = 21;
  } else if (breakpoint === 'lg') {
    bladeWidth = Math.min(windowWidth * 0.20, 150);
    bladeHeight = Math.min(windowWidth * 0.52, 340);
    spreadAngle = 70;
    pivotPinch = 22;
  } else {
    bladeWidth = Math.min(windowWidth * 0.15, 182);
    bladeHeight = Math.min(windowWidth * 0.36, 428);
    spreadAngle = 110;
    pivotPinch = 26;
  }

  const halfAngle = spreadAngle / 2;
  const angleStep = spreadAngle / (CHAPTERS.length - 1);
  const angles = [];
  for (let i = 0; i < CHAPTERS.length; i++) {
    angles.push(-halfAngle + i * angleStep);
  }

  return {
    bladeWidth,
    bladeHeight,
    angles,
    pivotPinch,
  };
}

/* ─── sub-components ──────────────────────────────────────────── */

function FanBlade({
  chapter,
  index,
  inView,
  isActive,
  anyActive,
  onEnter,
  onLeave,
  geometry,
  delay,
}: {
  chapter: Chapter;
  index: number;
  inView: boolean;
  isActive: boolean;
  anyActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  geometry: ReturnType<typeof useGeometry>;
  delay: number;
}) {
  const { bladeWidth, bladeHeight, angles, pivotPinch } = geometry;
  const angle = angles[index];
  const targetAngle = isActive ? angle * 0.86 : angle;
  const scale = isActive ? 1.03 : 1;
  const fontSizeScale = pivotPinch / 26;

  return (
    <motion.button
      aria-label={`Chapter ${chapter.num}: ${chapter.title} — ${chapter.sub}`}
      style={{
        position: 'absolute',
        bottom: 0,
        left: `calc(50% - ${bladeWidth / 2}px)`,
        width: bladeWidth,
        height: bladeHeight,
        transformOrigin: 'bottom center',
        clipPath: `polygon(0% 0%, 100% 0%, calc(50% + ${pivotPinch / 2}px) 100%, calc(50% - ${pivotPinch / 2}px) 100%)`,
        zIndex: isActive ? 30 : index + 2,
        background: chapter.bg,
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        padding: 0,
        margin: 0,
        filter: isActive
          ? 'drop-shadow(0 0 24px rgba(255,120,60,.45)) drop-shadow(0 0 70px rgba(255,90,40,.22))'
          : 'drop-shadow(-3px 0 16px rgba(5,2,1,0.75))',
      }}
      initial={{ rotate: 0, opacity: 0, scale: 0.9 }}
      animate={{
        rotate: inView ? targetAngle : 0,
        opacity: inView ? (anyActive && !isActive ? 0.48 : 1) : 0,
        scale: inView ? scale : 0.9,
      }}
      transition={{
        type: 'spring',
        stiffness: isActive ? 160 : 60,
        damping: isActive ? 18 : 12,
        mass: 0.75,
        delay: anyActive ? 0 : delay,
        opacity: { duration: 0.28, delay: anyActive ? 0 : delay + 0.1 },
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onTouchStart={onEnter}
      onTouchEnd={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <Link href={`/menu#${chapter.slug}`} style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        textDecoration: 'none',
        color: 'inherit',
        pointerEvents: 'none',
      }} aria-hidden="true">
        {/* Brass Edge Shimmer */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(255,180,100,0.24) 0px, transparent 14px, transparent calc(100% - 14px), rgba(255,180,100,0.24) 100%)',
          }}
        />
        {/* Lacquer Sheen */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0, left: '8%', right: '8%',
            height: '1px',
            background: `linear-gradient(to right, transparent, rgba(255,200,130,${isActive ? 0.9 : 0.65}), transparent)`,
            transition: 'background 0.2s ease',
          }}
        />
        {/* Ghost Chapter Number */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '6%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: `${Math.round(bladeWidth * 0.72)}px`,
            lineHeight: 1,
            color: `rgba(255,90,40,${isActive ? 0.16 : 0.10})`,
            letterSpacing: '-0.04em',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            transition: 'color 0.2s ease',
          }}
        >
          {chapter.num}
        </div>
        {/* Vertical Text */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            bottom: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6 * fontSizeScale,
          }}
        >
          <span
            lang="ja"
            style={{
              fontFamily: 'var(--font-jp)',
              fontSize: 14 * fontSizeScale,
              fontWeight: 700,
              color: `rgba(255,130,80,${isActive ? 0.98 : 0.58})`,
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              letterSpacing: '0.08em',
              lineHeight: 1.3,
              transition: 'color 0.2s ease',
            }}
          >
            {chapter.jp}
          </span>
          <div
            aria-hidden="true"
            style={{
              width: 1,
              height: 22 * fontSizeScale,
              flexShrink: 0,
              background: `rgba(255,170,100,${isActive ? 0.75 : 0.28})`,
              transition: 'background 0.2s ease',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10 * fontSizeScale,
              fontWeight: 900,
              letterSpacing: '0.38em',
              color: `rgba(255,120,70,${isActive ? 0.92 : 0.48})`,
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transition: 'color 0.2s ease',
            }}
          >
            {chapter.num}
          </span>
        </div>
      </Link>
    </motion.button>
  );
}

function ChapterDetail({ chapter }: { chapter: Chapter }) {
  return (
    <motion.div
      key={chapter.num}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.3, 1] }}
      style={{
        textAlign: 'center',
        maxWidth: '620px',
        padding: '0 clamp(16px,5vw,24px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(10px,2vw,14px)',
          marginBottom: 'clamp(10px,1.5vw,14px)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(10px,1.4vw,12px)',
            fontWeight: 900,
            letterSpacing: '0.48em',
            color: 'var(--clr-red)',
            textTransform: 'uppercase',
          }}
        >
          {chapter.num}
        </span>
        <span style={{ width: 28, height: 1, background: 'rgba(255,110,50,0.45)', display: 'block', flexShrink: 0 }} />
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(10px,1.4vw,12px)',
            fontWeight: 700,
            letterSpacing: '0.26em',
            color: 'rgba(255,240,210,0.52)',
            textTransform: 'uppercase',
          }}
        >
          {chapter.sub}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: 'clamp(8px,1.5vw,18px)',
          flexWrap: 'wrap',
          marginBottom: 'clamp(12px,1.8vw,16px)',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(34px,4.5vw,66px)',
            letterSpacing: '-0.03em',
            lineHeight: 0.92,
            color: '#FFF8E7',
            textTransform: 'uppercase',
          }}
        >
          {chapter.title}
        </h3>
        <span
          lang="ja"
          style={{
            fontFamily: 'var(--font-jp)',
            fontSize: 'clamp(14px,1.8vw,22px)',
            fontWeight: 700,
            color: '#FF6D3D',
            opacity: 0.95,
            letterSpacing: '0.12em',
          }}
        >
          {chapter.jp}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(14px,2.5vw,34px)',
          flexWrap: 'wrap',
          marginBottom: 'clamp(10px,1.5vw,12px)',
        }}
      >
        {chapter.dishes.map(d => (
          <span
            key={d}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(11px,1.1vw,14px)',
              letterSpacing: '0.18em',
              color: 'rgba(255,240,210,0.68)',
              textTransform: 'uppercase',
            }}
          >
            {d}
          </span>
        ))}
      </div>
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(10px,1.1vw,12px)',
          fontWeight: 700,
          letterSpacing: '0.26em',
          color: 'rgba(255,230,190,0.40)',
          textTransform: 'uppercase',
        }}
      >
        {chapter.price}
      </span>
    </motion.div>
  );
}

function StaticGrid() {
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))',
          gap: '1px',
          background: 'rgba(240,235,216,0.07)',
          border: '1px solid rgba(240,235,216,0.07)',
        }}
      >
        {CHAPTERS.map(ch => (
          <Link
            key={ch.num}
            href={`/menu#${ch.slug}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 'clamp(28px,4vw,44px) clamp(24px,3.5vw,36px)',
              background: ch.bg,
              textDecoration: 'none',
              gap: 12,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: '0.4em',
                color: 'var(--clr-red)',
                textTransform: 'uppercase',
              }}
            >
              {ch.num}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: 'clamp(22px,2.4vw,32px)',
                  letterSpacing: '-0.02em',
                  color: '#FFF8E7',
                  textTransform: 'uppercase',
                }}
              >
                {ch.title}
              </span>
              <span
                lang="ja"
                style={{
                  fontFamily: 'var(--font-jp)',
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--clr-red)',
                  opacity: 0.85,
                }}
              >
                {ch.jp}
              </span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(11px,1vw,13px)',
                letterSpacing: '0.04em',
                color: 'rgba(255,240,210,0.65)',
                lineHeight: 1.55,
              }}
            >
              {ch.dishes.join(' · ')}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.22em',
                color: 'rgba(255,230,190,0.38)',
                textTransform: 'uppercase',
                marginTop: 4,
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

export default function MenuGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-8%' });
  const prefersLess = useReducedMotion();
  const { breakpoint, windowWidth } = useBreakpoint();
  const geometry = useGeometry(breakpoint, windowWidth);

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const displayChapter = CHAPTERS[activeIdx ?? 0];
  const anyActive = activeIdx !== null;

  return (
    <section
      id="menu"
      ref={sectionRef}
      aria-label="Menu chapters"
      style={{
        background: '#0A0808',
        position: 'relative',
        borderTop: '1px solid rgba(255,110,50,0.12)',
        paddingTop: 'clamp(72px,9vw,120px)',
        paddingBottom: 'clamp(72px,9vw,120px)',
        overflow: 'hidden',
      }}
    >
      {/* Warm Radial Background Glow */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.6, delay: 0.2, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: `
            radial-gradient(circle at 50% 120%, rgba(255,90,40,0.16) 0%, rgba(0,0,0,0) 55%),
            radial-gradient(circle at 50% 100%, rgba(190,80,30,0.10) 0%, rgba(0,0,0,0) 65%),
            radial-gradient(circle at 50% 95%, rgba(150,60,20,0.07) 0%, rgba(0,0,0,0) 75%)
          `,
        }}
      />

      <div
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '0 clamp(16px,5vw,24px)',
          textAlign: 'center',
          marginBottom: 'clamp(36px,5vw,56px)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{ marginBottom: 'clamp(12px,1.8vw,16px)' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(10px,1.3vw,12px)',
              fontWeight: 900,
              letterSpacing: '0.5em',
              color: '#FF7240',
              textTransform: 'uppercase',
            }}
          >
            THE MENU · <span lang="ja" style={{ fontFamily: 'var(--font-jp)', letterSpacing: '0.2em' }}>料理</span>
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.3, 1] }}
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(36px,5.2vw,86px)',
            letterSpacing: '-0.035em',
            lineHeight: 0.90,
            color: '#FFF8E7',
            textTransform: 'uppercase',
          }}
        >
          SIX CHAPTERS. <span style={{ color: '#FF6D3D' }}>ONE KITCHEN.</span>
        </motion.h2>
      </div>

      {prefersLess ? (
        <div
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            padding: '0 clamp(16px,5vw,24px)',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <StaticGrid />
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <Link
              href="/menu"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(11px,1.2vw,13px)',
                fontWeight: 900,
                letterSpacing: '0.4em',
                color: '#0A0808',
                background: '#FF6D3D',
                padding: '18px 40px',
                minHeight: '56px',
                textDecoration: 'none',
                textTransform: 'uppercase',
                borderRadius: 0,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              VIEW FULL MENU <span style={{ fontSize: 16, lineHeight: '1' }}>→</span>
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: 'relative',
              minHeight: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AnimatePresence mode="wait">
              <ChapterDetail key={displayChapter.num} chapter={displayChapter} />
            </AnimatePresence>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: anyActive ? 0 : 0.42 } : {}}
            transition={{ duration: 0.5, delay: 0.9 }}
            style={{
              textAlign: 'center',
              marginBottom: 'clamp(12px,1.8vw,16px)',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(9px,1.1vw,11px)',
              fontWeight: 700,
              letterSpacing: '0.42em',
              color: 'rgba(255,220,180,0.70)',
              textTransform: 'uppercase',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {breakpoint === 'xl' ? '── HOVER A CHAPTER ──' : '── TAP A CHAPTER ──'}
          </motion.div>
          <div
            id="ht-fan-stage"
            style={{
              position: 'relative',
              zIndex: 2,
              height: geometry.bladeHeight + 32,
              width: '100%',
              maxWidth: 'min(92vw, 920px)',
              margin: '0 auto',
              overflow: 'visible',
              display: 'flex',
              justifyContent: 'center',
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
                delay={i * 0.1}
              />
            ))}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: Math.max(14, Math.min(18, windowWidth * 0.02)),
                height: Math.max(14, Math.min(18, windowWidth * 0.02)),
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #FFC37A, #8A5C20)',
                border: '1px solid rgba(255,180,100,0.65)',
                boxShadow: '0 0 16px rgba(255,140,70,0.45), inset 0 1px 3px rgba(255,230,170,0.35)',
                zIndex: 40,
              }}
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.85 }}
            style={{
              textAlign: 'center',
              marginTop: 'clamp(40px,5.5vw,60px)',
            }}
          >
            <Link
              href="/menu"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(11px,1.2vw,13px)',
                fontWeight: 900,
                letterSpacing: '0.4em',
                color: '#0A0808',
                background: '#FF6D3D',
                padding: '18px 44px',
                minHeight: '56px',
                textDecoration: 'none',
                textTransform: 'uppercase',
                transition: 'background 0.18s ease, transform 0.08s ease',
                borderRadius: 0,
                WebkitTapHighlightColor: 'transparent',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#FF8A59'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#FF6D3D'; }}
              onMouseDown={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(0.985)'; }}
              onMouseUp={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'; }}
              onTouchStart={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#FF8A59'; }}
              onTouchEnd={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#FF6D3D'; }}
            >
              VIEW FULL MENU <span style={{ fontSize: 16, lineHeight: '1' }}>→</span>
            </Link>
          </motion.div>
        </div>
      )}

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 50,
          background: 'radial-gradient(ellipse 80% 65% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)',
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
