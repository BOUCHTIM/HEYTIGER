'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

export default function LandingHero({
  onReserve,
  onExplore,
}: {
  onReserve: () => void;
  onExplore: () => void;
}) {
  const reduceMotion = !!useReducedMotion();
  const heroVariant = useMemo(
    () => ({
      hidden: reduceMotion ? {} : { opacity: 0, y: 14 },
      show: { opacity: 1, y: 0 },
    }),
    [reduceMotion],
  );

  return (
    <section
      id="hero"
      aria-label="Hey Tiger — Hero"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '88px',
        background: 'var(--clr-void)',
        overflow: 'hidden',
      }}
    >
      {/* Background media */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <div className="ht-hero-panorama-track">
          {[
            '/images/header/hero-pexels.jpg',
            '/images/header/header-2.jpg',
            '/images/header/header-1.jpg',
            '/images/spaces/rooftop.jpg',
            '/images/spaces/bar.jpg',
            '/images/header/hero-pexels.jpg',
            '/images/header/header-2.jpg',
            '/images/header/header-1.jpg',
            '/images/spaces/rooftop.jpg',
            '/images/spaces/bar.jpg',
          ].map((src, i) => (
            <div key={`${src}-${i}`} className="ht-hero-panorama-item">
              <Image
                src={src}
                alt=""
                fill
                priority={i < 3}
                unoptimized
                sizes="100vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
          ))}
        </div>
        {/* P2 — overlay boosted to 0.50 to guarantee 4.5:1 on worst-case bright frames */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.50)',
          pointerEvents: 'none',
        }} />
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={heroVariant}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          zIndex: 2,
          width: 'min(1100px, calc(100% - 2 * clamp(18px, 4vw, 44px)))',
          textAlign: 'center',
          paddingBottom: 'clamp(24px, 6vh, 64px)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-jp-rough)',
            fontSize: 'clamp(16px, 2.2vw, 22px)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--clr-cream-30)',
            marginBottom: 'clamp(10px, 2vh, 16px)',
          }}
          aria-hidden="true"
          lang="ja"
        >
          おいトラ
        </p>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-label)',
            fontWeight: 900,
            letterSpacing: '0.46em',
            textTransform: 'uppercase',
            color: 'var(--clr-red-80)',
            marginBottom: 'clamp(22px, 5vh, 40px)',
          }}
        >
          へイ、タイガー
          <span aria-hidden="true" style={{ opacity: 0.4, marginInline: 10 }}>
            —
          </span>
          ON THE OTHER END, A VOICE…
        </p>

        {/* R1 — changed from <h1> to div[role=presentation]; sr-only <h1> in page.tsx is the real heading */}
        <div
          role="presentation"
          style={{
            margin: 0,
            paddingTop: '0.14em',
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
          }}
        >
          <span
            className="ht-neon"
            style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'var(--text-heading-hero)',
              color: '#FFFFFF',
              animation: 'neonFlickerYellow 4.5s infinite 0.1s',
              textShadow: '0 2px 12px rgba(0,0,0,0.7)',
            }}
          >
            HEY
          </span>
          <span
            className="ht-neon"
            style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'var(--text-heading-hero)',
              color: 'var(--clr-red)',
              animation: 'neonFlickerRed 4.5s infinite 0.4s',
              textShadow: '0 2px 12px rgba(0,0,0,0.7)',
            }}
          >
            TIGER
          </span>
        </div>

        {/* Plain-language value prop — sentence case for readability (Level 4) */}
        <p
          style={{
            marginTop: 'clamp(12px, 2.8vh, 20px)',
            marginInline: 'auto',
            maxWidth: '40ch',
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(14px, 1.35vw, 18px)',
            lineHeight: 1.55,
            letterSpacing: '0.01em',
            color: 'var(--clr-cream-70)',
          }}
        >
          Japanese bar &amp; restaurant, Motor City Dubai. Come for the food. Stay for everything after.
        </p>

        {/* Japanese signature line — preserved */}
        <p
          lang="ja"
          style={{
            marginTop: 'clamp(6px, 1.4vh, 10px)',
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(11px, 1vw, 13px)',
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
            color: 'var(--clr-red-80)',
          }}
        >
          おいトラ — RAAAAAAR CULTURE · MOTOR CITY DUBAI
        </p>

        {/* Meta row — high-signal operational facts (Level 1) */}
        <div
          style={{
            marginTop: 'clamp(14px, 3vh, 22px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'clamp(8px, 1.4vw, 16px)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-label)',
            fontWeight: 800,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--clr-cream-70)',
          }}
        >
          <span>Open till 2AM</span>
          <span aria-hidden="true" style={{ color: 'var(--clr-red-80)' }}>·</span>
          <span>47 sake labels</span>
          <span aria-hidden="true" style={{ color: 'var(--clr-red-80)' }}>·</span>
          <span>Rooftop · Late Nights</span>
        </div>

        <div
          style={{
            marginTop: 'clamp(22px, 6vh, 44px)',
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {/* Primary CTA — single global label */}
          <button
            onClick={onReserve}
            style={{
              background: 'var(--clr-red)',
              color: 'var(--clr-void)',
              border: 0,
              borderRadius: 0,
              padding: '15px 26px',
              minHeight: '44px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-label)',
              fontWeight: 900,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              transition: 'background var(--dur-fast) var(--ease-standard)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--clr-red-dim)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--clr-red)';
            }}
          >
            BOOK A TABLE
          </button>

          {/* Secondary — lighter, never competing */}
          <button
            onClick={onExplore}
            style={{
              background: 'transparent',
              color: 'var(--clr-cream-70)',
              border: 0,
              borderRadius: 0,
              padding: '15px 18px',
              minHeight: '44px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-label)',
              fontWeight: 700,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              textDecoration: 'underline',
              textUnderlineOffset: '5px',
              textDecorationColor: 'var(--clr-cream-30)',
              transition: 'color var(--dur-fast) var(--ease-standard)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--clr-cream)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--clr-cream-70)';
            }}
          >
            EXPLORE THE STORY
          </button>
        </div>

        {/* Booking scope microcopy */}
        <p
          style={{
            marginTop: 'clamp(12px, 2vh, 16px)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-label)',
            letterSpacing: '0.04em',
            color: 'var(--clr-cream-30)',
          }}
        >
          Dinner, drinks &amp; weekend brunch. Private nights in the Tiger&apos;s Den.
        </p>
      </motion.div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 'clamp(14px, 3vw, 40px)',
          bottom: 'clamp(18px, 3.5vh, 34px)',
          zIndex: 2,
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-micro)',
          fontWeight: 800,
          letterSpacing: '0.34em',
          textTransform: 'uppercase',
          color: 'var(--clr-cream-30)',
        }}
      >
        THE ROARING GRIDDLE
        <br />
        <span style={{ opacity: 0.75 }}>FLAME CHAMBERS — HEI HEI</span>
      </div>

      <style>{`
        .ht-hero-panorama-track {
          position: absolute;
          inset: 0;
          display: flex;
          width: max-content;
          height: 100%;
          animation: ht-hero-panorama-scroll 90s linear infinite;
          will-change: transform;
        }
        .ht-hero-panorama-item {
          position: relative;
          width: max(100vw, 1280px);
          height: 100%;
          flex: 0 0 auto;
        }
        @keyframes ht-hero-panorama-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ht-hero-panorama-track {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}

