'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { QRCodeCanvas } from 'qrcode.react';

/* ─── Category data ───────────────────────────────────────────────────── */
const MENU_QR_URL = 'https://heytigerdubai.com/menu';

const CATEGORIES = [
  {
    num: '01',
    id: 'izakaya',
    title: 'IZAKAYA',
    jp: '居酒屋',
    kanji: '食',
    sub: 'Pass it around the table',
    dishes: 'Wagyu gyoza · Truffle karaage · Crispy rice',
    desc: 'Wagyu gyoza. Crispy rice. Truffle karaage. Built to be passed around the table until someone asks for more.',
    range: 'AED 65–210',
    accent: 'var(--clr-red)',
    photo: { src: '/images/spaces/dining.jpg', objectPosition: 'center 50%' },
  },
  {
    num: '02',
    id: 'robata',
    title: 'ROBATA',
    jp: '炉端焼き',
    kanji: '炎',
    sub: 'Built over real fire',
    dishes: 'A5 wagyu skewers · Miso black cod · Tiger prawn',
    desc: 'A5 wagyu skewers. Miso black cod. Tiger prawn kushiyaki. Over binchotan — nothing in between fire and flavour.',
    range: 'AED 65–320',
    accent: 'var(--clr-red)',
    photo: { src: '/images/spaces/bar.jpg', objectPosition: 'center 50%' },
  },
  {
    num: '03',
    id: 'ramen',
    title: 'RAMEN',
    jp: '拉麺',
    kanji: '麺',
    sub: 'Open after midnight',
    dishes: 'Tiger Broth · Red Dragon · Cold Tiger',
    desc: 'Tiger Broth. Red Dragon. Cold Tiger. Broths built on bone and time. The Den opens at 7:30. The broth never stopped.',
    range: 'AED 145–185',
    accent: 'var(--clr-red)',
    photo: { src: '/images/spaces/den.jpg', objectPosition: 'center 46%' },
  },
  {
    num: '04',
    id: 'sushi',
    title: 'SUSHI BAR',
    jp: '鮨バー',
    kanji: '鮨',
    sub: 'Ocean decides the menu',
    dishes: 'Omakase nigiri · The RAAAAAAR Roll · Sashimi',
    desc: 'Omakase nigiri. The RAAAAAAR Roll — wagyu, foie gras, gold leaf. Premium sashimi, freshly grated wasabi. The ocean decides.',
    range: 'AED 110–420',
    accent: 'var(--clr-red)',
    photo: { src: '/images/spaces/dining-night.jpg', objectPosition: 'center 48%' },
  },
  {
    num: '05',
    id: 'cocktails',
    title: 'COCKTAILS',
    jp: 'カクテル',
    kanji: '酒',
    sub: 'Eight originals. One for you.',
    dishes: 'RAAAAAAR · Tokyo Negroni · VOID',
    desc: 'RAAAAAAR. Tokyo Negroni. VOID — after 10PM only. Eight originals that tell eight different stories. One of them is yours.',
    range: 'AED 130–180',
    accent: 'var(--clr-red)',
    photo: { src: '/images/spaces/terrace-night.jpg', objectPosition: 'center 50%' },
  },
  {
    num: '06',
    id: 'desserts',
    title: 'DESSERTS',
    jp: '甘味',
    kanji: '甘',
    sub: 'No portion control here',
    dishes: 'Miso lava cake · Black sesame cheesecake · Matcha tiramisu',
    desc: 'Miso caramel lava cake. Black sesame cheesecake. Matcha tiramisu. No apologies. No portion control.',
    range: 'AED 75–95',
    accent: 'var(--clr-red)',
    photo: { src: '/images/spaces/terrace-day.jpg', objectPosition: 'center 50%' },
  },
];

/* ─── Component ───────────────────────────────────────────────────────── */
export default function MenuGrid() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-6% 0px' });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reduceMotion = !!useReducedMotion();

  return (
    <section
      id="menu"
      ref={ref}
      aria-label="Menu categories"
      data-texture="on"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--clr-void)',
      }}
    >
      {/* Giant kanji watermark */}
      <div style={{
        position: 'absolute',
        right: '-4%', top: '-8%',
        fontFamily: 'var(--font-jp)',
        fontWeight: 900,
        fontSize: 'clamp(280px, 40vw, 580px)',
        color: 'rgba(255,255,255,0.04)',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
        zIndex: 0,
      }} aria-hidden="true">
        食
      </div>

      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        style={{
          position: 'relative', zIndex: 2,
          padding: 'var(--space-section-y-lg) var(--space-section-x) clamp(48px, 5vw, 72px)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'end',
          gap: '40px',
          backgroundColor: 'transparent',
          border: '1px solid var(--border-structural)',
          borderRadius: 0,
          overflow: 'hidden',
        }}
        className="menu-header"
      >

        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
          <motion.div
            initial={{ x: 0 }}
            animate={inView ? { x: '-108%' } : { x: 0 }}
            transition={{ duration: 1.95, ease: [0.22, 0.9, 0.18, 1], delay: 0.16 }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '52%',
              backgroundColor: 'rgba(241,230,205,0.94)',
              borderRight: '1px solid rgba(13,13,13,0.18)',
              boxShadow: '16px 0 30px rgba(0,0,0,0.22)',
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(13,13,13,0.12) 0px, rgba(13,13,13,0.12) 1px, transparent 1px, transparent 34px), repeating-linear-gradient(0deg, rgba(13,13,13,0.1) 0px, rgba(13,13,13,0.1) 1px, transparent 1px, transparent 34px)',
              backgroundSize: 'auto',
              backgroundPosition: '0 0',
            }}
          >
            <div style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '56px', borderRadius: '999px', background: 'rgba(13,13,13,0.18)' }} />
          </motion.div>

          <motion.div
            initial={{ x: 0 }}
            animate={inView ? { x: '108%' } : { x: 0 }}
            transition={{ duration: 1.95, ease: [0.22, 0.9, 0.18, 1], delay: 0.16 }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '52%',
              backgroundColor: 'rgba(241,230,205,0.94)',
              borderLeft: '1px solid rgba(13,13,13,0.18)',
              boxShadow: '-16px 0 30px rgba(0,0,0,0.22)',
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(13,13,13,0.12) 0px, rgba(13,13,13,0.12) 1px, transparent 1px, transparent 34px), repeating-linear-gradient(0deg, rgba(13,13,13,0.1) 0px, rgba(13,13,13,0.1) 1px, transparent 1px, transparent 34px)',
              backgroundSize: 'auto',
              backgroundPosition: '0 0',
            }}
          >
            <div style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '56px', borderRadius: '999px', background: 'rgba(13,13,13,0.18)' }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 1 }}
            animate={inView ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.75, ease: 'easeOut', delay: 1.05 }}
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '2px',
              transform: 'translateX(-50%)',
              background: 'rgba(13,13,13,0.22)',
            }}
          />
        </div>

        <div style={{ maxWidth: 'min(720px, 100%)' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-label)',
              letterSpacing: 'var(--tracking-ultra)',
              color: 'var(--clr-red-80)',
              fontWeight: 700,
            }}>
              THE MENU · <span lang="ja">料理</span> · MOTOR CITY
            </span>
          </div>
          <h2 style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'var(--text-heading-xl)',
            lineHeight: 0.94,
            letterSpacing: 'var(--tracking-tight)',
            color: 'var(--clr-red)',
            display: 'inline-block',
            animation: reduceMotion ? 'none' : 'neonFlickerRed 4.5s infinite 0.2s',
          }}>
            SIX WORLDS.<br />
            <span style={{ color: 'var(--clr-cream)' }}>ONE KITCHEN.</span>
          </h2>

          {/* Japanese display */}
          <div lang="ja" style={{
            marginTop: 'clamp(16px, 2vw, 28px)',
            fontFamily: 'var(--font-jp)',
            fontSize: 'var(--text-jp-display)',
            fontWeight: 700,
            color: 'var(--clr-red)',
            letterSpacing: '0.08em',
          }}>おいトラ</div>
        </div>

        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          <div
            aria-hidden="true"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '18px',
              marginTop: 'clamp(30px, 2.6vw, 40px)',
              marginBottom: '10px',
              opacity: 0.95,
              flexShrink: 0,
              pointerEvents: 'none',
            }}
          >
            <Image
              src="/BMH-logo.png"
              alt=""
              width={220}
              height={96}
              priority
              unoptimized
              style={{
                height: 'clamp(64px, 6.2vw, 96px)',
                width: 'auto',
                display: 'block',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
                flexShrink: 0,
              }}
            />
            <Image
              src="/heytiger-logo.png"
              alt=""
              width={300}
              height={96}
              priority
              unoptimized
              style={{
                height: 'clamp(64px, 6.2vw, 96px)',
                width: 'auto',
                display: 'block',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
                flexShrink: 0,
              }}
            />
          </div>
          <p lang="ja" style={{
            fontFamily: 'var(--font-jp)',
            fontSize: '16px',
            letterSpacing: '0.15em',
            color: 'var(--clr-cream-70)',
            marginBottom: '8px',
            lineHeight: 1.8,
          }}>
            日本料理<br />
            居酒屋スタイル
          </p>
          <a
            href="/menu"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: 0,
              border: '1px solid var(--border-structural)',
              background: 'rgba(18,13,20,0.5)',
              textDecoration: 'none',
              marginBottom: '18px',
            }}
            aria-label="Scan to open the menu"
          >
            <div style={{
              padding: '8px',
              background: 'var(--clr-cream)',
              borderRadius: 0,
              lineHeight: 0,
            }}>
              <QRCodeCanvas
                value={MENU_QR_URL}
                size={74}
                bgColor="var(--clr-cream)"
                fgColor="var(--clr-void)"
                level="M"
                style={{ display: 'block' }}
              />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-micro)',
                letterSpacing: '0.26em',
                fontWeight: 800,
                color: 'var(--clr-red)',
                marginBottom: '6px',
              }}>
                SCAN MENU
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-label)',
                letterSpacing: '0.14em',
                color: 'rgba(240,235,216,0.72)',
                fontWeight: 600,
              }}>
                heytigerdubai.com/menu
              </div>
            </div>
          </a>
          <Link
            href="/menu"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body)',
              letterSpacing: '0.18em',
              fontWeight: 700,
              color: 'var(--clr-void)',
              background: 'var(--clr-red)',
              padding: '16px 40px',
              borderRadius: 0,
              textDecoration: 'none',
              border: 'none',
              transition: 'background var(--dur-fast) var(--ease-standard)',
              whiteSpace: 'nowrap',
              minHeight: '44px',
              textTransform: 'uppercase',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-red-dim)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--clr-red)'; }}
          >
            VIEW FULL MENU
            <span style={{ fontSize: '16px', lineHeight: 1 }}>→</span>
          </Link>
        </div>
      </motion.div>

      {/* ── Categories grid ── */}
      <div
        style={{
          position: 'relative', zIndex: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderTop: '1px solid var(--border-structural)',
        }}
        className="menu-cats"
      >
        {CATEGORIES.map((cat, i) => (
          <CategoryBlock
            key={cat.id}
            cat={cat}
            index={i}
            inView={inView}
            isHovered={hoveredId === cat.id}
            anyHovered={hoveredId !== null}
            onHover={setHoveredId}
          />
        ))}
      </div>

      {/* ── Bottom strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="ht-dynamic-strip"
        style={{
          position: 'relative', zIndex: 2,
          borderTop: '1px solid var(--border-structural)',
          background: 'none',
          backgroundColor: 'var(--clr-void)',
          padding: 'clamp(24px, 3vw, 36px) var(--space-section-x)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {['SHARING PLATES', 'SAKE · 47 LABELS', 'OPEN TILL 4AM', 'MOTOR CITY DUBAI'].map((label, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body)',
              letterSpacing: '0.28em',
              color: 'rgba(240,235,216,0.65)',
            }}>
              {label}
            </span>
          ))}
        </div>
        <Link
          href="/menu"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: 'var(--text-body)',
            letterSpacing: '0.18em',
            color: 'var(--clr-void)',
            backgroundColor: 'var(--clr-red)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 32px',
            borderRadius: 0,
            minHeight: '44px',
            textTransform: 'uppercase',
            transition: 'background var(--dur-fast) var(--ease-standard)',
          }}
          onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = 'var(--clr-red-dim)'; }}
          onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = 'var(--clr-red)'; }}
        >
          VIEW FULL MENU <span>→</span>
        </Link>
      </motion.div>

      <style>{`
        @media (max-width: 900px) {
          .menu-cats { grid-template-columns: repeat(2, 1fr) !important; }
          .menu-header { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .menu-cats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '').trim();
  const full = normalized.length === 3
    ? normalized.split('').map((c) => c + c).join('')
    : normalized;
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/* ─── Individual Category Block ──────────────────────────────────────── */
function CategoryBlock({
  cat, index, inView, isHovered, anyHovered, onHover,
}: {
  cat: typeof CATEGORIES[0];
  index: number;
  inView: boolean;
  isHovered: boolean;
  anyHovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const forcedBg = 'var(--clr-void)';

  const forcedBorder = null;
  const cardBase = isHovered
    ? 'rgba(13,13,13,0.24)'
    : anyHovered
    ? 'rgba(13,13,13,0.14)'
    : 'rgba(13,13,13,0.12)';

  const photoOpacity = isHovered ? 1 : 0;
  const photoScale = isHovered ? 1.06 : 1.02;

  return (
    <motion.a
      href={`/menu#${cat.id}`}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.09, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={(e) => {
        onHover(cat.id);
        e.currentTarget.style.setProperty('--mr', '180px');
      }}
      onMouseLeave={(e) => {
        onHover(null);
        e.currentTarget.style.setProperty('--mr', '0px');
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mx', `${x}px`);
        e.currentTarget.style.setProperty('--my', `${y}px`);
      }}
      aria-label={`See ${cat.title} dishes on the menu`}
      style={{
        position: 'relative',
        padding: 'clamp(28px, 3.5vw, 48px) clamp(24px, 3vw, 40px)',
        borderRight: (index + 1) % 3 !== 0 ? '1px solid var(--border-structural)' : 'none',
        borderBottom: index < 3 ? '1px solid var(--border-structural)' : 'none',
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        overflow: 'hidden',
        transition: 'background-color 0.35s',
        backgroundColor: forcedBg ?? cardBase,
        ...(forcedBorder ?? {}),
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          opacity: photoOpacity,
          transition: 'opacity 0.25s',
          pointerEvents: 'none',
          overflow: 'hidden',
          WebkitMaskImage:
            'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(0,0,0,1) 0px, rgba(0,0,0,1) var(--mr, 0px), rgba(0,0,0,0) calc(var(--mr, 0px) + 1px))',
          WebkitMaskRepeat: 'no-repeat',
          maskImage:
            'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(0,0,0,1) 0px, rgba(0,0,0,1) var(--mr, 0px), rgba(0,0,0,0) calc(var(--mr, 0px) + 1px))',
          maskRepeat: 'no-repeat',
        }}
      >
        <Image
          src={cat.photo.src}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 34vw"
          style={{
            objectFit: 'cover',
            objectPosition: cat.photo.objectPosition,
            transform: `scale(${photoScale})`,
            transition: 'transform 0.6s',
            filter: 'contrast(1.08) saturate(1.24) brightness(1.06)',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(13,13,13,0.62) 0%, rgba(13,13,13,0.26) 46%, rgba(13,13,13,0.70) 100%)',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background:
            `radial-gradient(70% 70% at 50% 35%, ${hexToRgba(cat.accent, 0.26)} 0%, rgba(0,0,0,0) 62%)`,
          mixBlendMode: 'screen',
        }} />
      </div>

      {/* Giant kanji bg */}
      <div style={{
        position: 'absolute',
        right: '-8%', bottom: '-12%',
        fontFamily: 'var(--font-jp)',
        fontWeight: 900,
        fontSize: 'clamp(100px, 12vw, 160px)',
        color: isHovered ? 'rgba(240,235,216,0.06)' : 'rgba(240,235,216,0.03)',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
        transition: 'color 0.35s',
        zIndex: 0,
      }} aria-hidden="true">
        {cat.kanji}
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body)',
            letterSpacing: '0.3em',
            color: isHovered ? cat.accent : 'rgba(240,235,216,0.55)',
            fontWeight: 700,
            transition: 'color var(--dur-fast) var(--ease-standard)',
          }}>
            {cat.num}
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: isHovered ? cat.accent : 'var(--border-structural)',
            transition: 'background 0.35s',
          }} />
        </div>

        <span lang="ja" style={{
          display: 'block',
          fontFamily: 'var(--font-jp)',
          fontSize: 'var(--text-body)',
          letterSpacing: '0.15em',
          color: isHovered ? cat.accent : 'var(--clr-cream-70)',
          marginBottom: '8px',
          transition: 'color var(--dur-fast) var(--ease-standard)',
        }}>
          {cat.jp}
        </span>

        <h3 style={{
          margin: '0 0 6px',
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: 'clamp(32px, 4vw, 58px)',
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
          color: isHovered ? 'var(--clr-cream)' : 'var(--clr-cream)',
          transition: 'color var(--dur-fast) var(--ease-standard)',
        }}>
          {cat.title}
        </h3>

        <span style={{
          display: 'block',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-body)',
          letterSpacing: '0.22em',
          color: isHovered ? cat.accent : 'rgba(240,235,216,0.6)',
          marginBottom: '18px',
          transition: 'color var(--dur-fast) var(--ease-standard)',
        }}>
          {cat.sub.toUpperCase()}
        </span>

        {/* Specific dish names — always visible */}
        <span style={{
          display: 'block',
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(14px, 1.15vw, 16px)',
          fontWeight: 600,
          letterSpacing: '0.01em',
          lineHeight: 1.5,
          color: isHovered ? 'var(--clr-cream)' : 'rgba(240,235,216,0.72)',
          marginBottom: '16px',
          transition: 'color var(--dur-fast) var(--ease-standard)',
        }}>
          {cat.dishes}
        </span>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(15px, 1.4vw, 18px)',
            lineHeight: 1.7,
            color: isHovered ? 'rgba(245,239,224,0.7)' : 'rgba(245,239,224,0.5)',
            marginBottom: 20,
            transition: 'color 0.28s',
          }}
        >
          {cat.desc}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginTop: '4px',
        }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            letterSpacing: '0.14em',
            fontWeight: 700,
            color: isHovered ? cat.accent : 'rgba(240,235,216,0.75)',
            transition: 'color var(--dur-fast) var(--ease-standard)',
          }}>
            {cat.range}
          </span>
          <motion.span
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 8 }}
            transition={{ duration: 0.2 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body)',
              letterSpacing: '0.22em',
              fontWeight: 700,
              color: 'var(--clr-cream)',
            }}
          >
            TASTE THIS →
          </motion.span>
        </div>
      </div>
    </motion.a>
  );
}
