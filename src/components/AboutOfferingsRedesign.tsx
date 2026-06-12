'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import SectionSticker from '@/components/SectionSticker';

/* ── data ───────────────────────────────────────────────── */

const YELLOW = '#FDBE06';

const PRIMARY_XP = [
  {
    id: '1',
    num: '01',
    tag: 'THE TABLE',
    title: 'IZAKAYA FARE',
    sub: 'Yakitori · Kushikatsu · Wagyu Gyoza',
  },
  {
    id: '2',
    num: '02',
    tag: 'THE BAR',
    title: 'SAKE CELLAR',
    sub: '47 Labels · Junmai to Daiginjo',
  },
  {
    id: '3',
    num: '03',
    tag: 'THE NIGHT',
    title: 'LATE NIGHTS',
    sub: 'The Den · Open till 4AM',
  },
] as const;

const SECONDARY_XP = [
  { id: '4', num: '04', title: 'ROOFTOP TERRACE', tag: 'SKYLINE VIEWS' },
  { id: '5', num: '05', title: 'WEEKEND BRUNCH',  tag: 'FAMILY BY DAY'  },
  { id: '6', num: '06', title: 'PRIVATE EVENTS',  tag: 'FULL BUYOUT'    },
] as const;

/* ── Primary experience row ─────────────────────────────── */

function PrimaryRow({
  exp,
  index,
  inView,
  reduceMotion,
}: {
  exp: typeof PRIMARY_XP[number];
  index: number;
  inView: boolean;
  reduceMotion: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const ease = [0.22, 1, 0.3, 1] as const;

  return (
    <motion.div
      initial={reduceMotion ? {} : { opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: 0.38 + index * 0.1, ease }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        padding: 'clamp(16px, 2vw, 24px) 0 clamp(16px, 2vw, 24px) clamp(16px, 2vw, 22px)',
        borderBottom: '1px solid rgba(240,235,216,0.08)',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      {/* Left amber indicator */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: '2px',
          background: YELLOW,
          transformOrigin: '50% 0',
          transform: hovered ? 'scaleY(1)' : 'scaleY(0)',
          transition: reduceMotion ? 'none' : 'transform 0.42s cubic-bezier(0.22,1,0.3,1)',
        }}
      />

      {/* Eyebrow: number — divider — tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '9px' }}>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            fontWeight: 900,
            letterSpacing: '0.42em',
            color: hovered ? YELLOW : 'var(--clr-red)',
            textTransform: 'uppercase',
            transition: reduceMotion ? 'none' : 'color 0.22s ease',
          }}
        >
          {exp.num}
        </span>
        <span
          style={{
            display: 'block',
            width: '20px',
            height: '1px',
            background: hovered ? `rgba(253,190,6,0.4)` : 'rgba(200,61,32,0.3)',
            flexShrink: 0,
            transition: reduceMotion ? 'none' : 'background 0.22s ease',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.3em',
            color: hovered ? `rgba(253,190,6,0.52)` : 'rgba(240,235,216,0.24)',
            textTransform: 'uppercase',
            transition: reduceMotion ? 'none' : 'color 0.22s ease',
          }}
        >
          {exp.tag}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          margin: '0 0 7px',
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: 'clamp(24px, 2.8vw, 40px)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          color: hovered ? YELLOW : 'var(--clr-cream)',
          textTransform: 'uppercase',
          transition: reduceMotion ? 'none' : 'color 0.22s ease',
        }}
      >
        {exp.title}
      </h3>

      {/* Sub */}
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(10px, 0.9vw, 12px)',
          letterSpacing: '0.16em',
          color: `rgba(240,235,216,${hovered ? 0.58 : 0.3})`,
          textTransform: 'uppercase',
          transition: reduceMotion ? 'none' : 'color 0.22s ease',
        }}
      >
        {exp.sub}
      </p>
    </motion.div>
  );
}

/* ── Main section ───────────────────────────────────────── */

export default function AboutOfferingsRedesign({
  reduceMotion,
  onReserve,
}: {
  reduceMotion: boolean;
  onReserve?: () => void;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-10% 0px' });
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      id="about"
      ref={containerRef}
      aria-label="Hey Tiger — what we are"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--clr-void)',
        borderTop: '1px solid var(--border-structural)',
        paddingTop:    'clamp(80px, 10vw, 136px)',
        paddingBottom: 'clamp(96px, 11vw, 152px)',
      }}
    >

      {/* ── Ambient ember glow — top-left warmth behind headline ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 72% 52% at 26% 28%, rgba(200,61,32,0.11) 0%, transparent 68%)',
          zIndex: 0,
        }}
      />

      {/* ── Inner content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 56px)',
        }}
      >
        <div className="ao-grid">

          {/* ════════════ LEFT — MANIFESTO ════════════ */}
          <div>

            {/* Venue identifier */}
            <motion.div
              initial={reduceMotion ? {} : { opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: 'clamp(20px, 2.5vw, 30px)',
              }}
            >
              <span
                lang="ja"
                style={{
                  fontFamily: 'var(--font-jp)',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  color: 'var(--clr-red-80)',
                }}
              >
                ヘイ・タイガー
              </span>
              <div style={{ width: '28px', height: '1px', background: 'rgba(200,61,32,0.3)', flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.4em',
                  color: 'rgba(240,235,216,0.32)',
                  textTransform: 'uppercase',
                }}
              >
                MOTOR CITY · DUBAI
              </span>
            </motion.div>

            {/* Brand mark — subordinate signature, not the hero */}
            <motion.div
              initial={reduceMotion ? {} : { opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.08 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(20px, 2.2vw, 32px)',
                letterSpacing: '0.07em',
                color: YELLOW,
                textTransform: 'uppercase',
                marginBottom: 'clamp(14px, 1.8vw, 22px)',
              }}
            >
              HEY TIGER
            </motion.div>

            {/* ── MANIFESTO — the dominant typographic moment ── */}
            <motion.h2
              initial={reduceMotion ? {} : { opacity: 0, x: -32 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.1, delay: 0.14, ease }}
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                lineHeight: 0.94,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                fontSize: 'clamp(54px, 8vw, 112px)',
              }}
            >
              <span style={{ display: 'block', color: 'var(--clr-cream)' }}>
                Family
              </span>
              <span style={{ display: 'block', color: 'var(--clr-cream)' }}>
                by day.
              </span>
              <span
                style={{
                  display: 'block',
                  marginTop: '0.06em',
                  color: 'rgba(240,235,216,0.82)',
                  fontSize: '0.68em',
                }}
              >
                After-hours
              </span>
              <span
                style={{
                  display: 'block',
                  color: 'rgba(240,235,216,0.82)',
                  fontSize: '0.68em',
                }}
              >
                chaos
              </span>
              <span
                style={{
                  display: 'block',
                  marginTop: '0.04em',
                  color: 'var(--clr-red)',
                  fontSize: '0.62em',
                }}
              >
                by night.
              </span>
            </motion.h2>

            {/* Body copy */}
            <motion.p
              initial={reduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                margin: 'clamp(28px, 3.5vw, 44px) 0 0',
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(13px, 1.1vw, 16px)',
                lineHeight: 1.72,
                letterSpacing: '0.01em',
                color: 'rgba(240,235,216,0.6)',
                maxWidth: '44ch',
              }}
            >
              Japanese izakaya with zero corporate friction.
              <br />
              Cold sake, loud tables, and a kitchen that never apologises.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={reduceMotion ? {} : { opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.44 }}
              style={{ marginTop: 'clamp(32px, 4vw, 48px)' }}
            >
              <button
                type="button"
                onClick={onReserve}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'var(--clr-red)',
                  color: 'var(--clr-void)',
                  border: 0,
                  padding: '15px 36px',
                  minHeight: '48px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  fontWeight: 900,
                  letterSpacing: '0.34em',
                  textTransform: 'uppercase',
                  transition: 'background var(--dur-fast) var(--ease-standard)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--clr-red-dim)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--clr-red)'; }}
              >
                BOOK TABLE
                <span aria-hidden="true" style={{ fontSize: '14px', lineHeight: 1 }}>→</span>
              </button>

              <p
                style={{
                  marginTop: '10px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  color: 'rgba(240,235,216,0.26)',
                }}
              >
                Dinner, drinks &amp; brunch reservations
              </p>
            </motion.div>

          </div>

          {/* ════════════ RIGHT — EXPERIENCES ════════════ */}
          <div className="ao-right">

            {/* Primary three */}
            <div>
              {PRIMARY_XP.map((exp, i) => (
                <PrimaryRow
                  key={exp.id}
                  exp={exp}
                  index={i}
                  inView={inView}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>

            {/* Secondary three */}
            <motion.div
              initial={reduceMotion ? {} : { opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.72 }}
              style={{
                marginTop:  'clamp(20px, 2.4vw, 28px)',
                paddingTop: 'clamp(20px, 2.4vw, 28px)',
                borderTop: '1px solid rgba(240,235,216,0.07)',
              }}
            >
              {/* Secondary label */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '14px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '9px',
                    fontWeight: 800,
                    letterSpacing: '0.4em',
                    color: 'rgba(240,235,216,0.22)',
                    textTransform: 'uppercase',
                  }}
                >
                  ALSO AT HEY TIGER
                </span>
                <div
                  style={{
                    flex: 1,
                    height: '1px',
                    background: 'rgba(240,235,216,0.05)',
                  }}
                />
              </div>

              {/* 3-column micro-grid */}
              <div className="ao-secondary">
                {SECONDARY_XP.map(exp => (
                  <div
                    key={exp.id}
                    style={{
                      padding: '12px 0',
                      borderTop: '1px solid rgba(240,235,216,0.06)',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-body)',
                        fontSize: '9px',
                        fontWeight: 900,
                        letterSpacing: '0.36em',
                        color: 'rgba(200,61,32,0.4)',
                        textTransform: 'uppercase',
                        marginBottom: '5px',
                      }}
                    >
                      {exp.num}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 900,
                        fontSize: 'clamp(13px, 1.3vw, 17px)',
                        letterSpacing: '-0.01em',
                        lineHeight: 1,
                        color: 'rgba(240,235,216,0.4)',
                        textTransform: 'uppercase',
                        marginBottom: '4px',
                      }}
                    >
                      {exp.title}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-body)',
                        fontSize: '9px',
                        fontWeight: 700,
                        letterSpacing: '0.22em',
                        color: 'rgba(240,235,216,0.2)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {exp.tag}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>{/* /right */}

        </div>{/* /ao-grid */}

        {/* ── Footer strip ── */}
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          style={{
            marginTop:  'clamp(60px, 8vw, 96px)',
            paddingTop: 'clamp(22px, 3vw, 34px)',
            borderTop: '1px solid rgba(240,235,216,0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Image
              src="/BMH-logo.png"
              alt=""
              width={120}
              height={64}
              unoptimized
              style={{
                height: 'clamp(34px, 4vw, 48px)',
                width: 'auto',
                filter: 'brightness(0) invert(1)',
                opacity: 0.22,
              }}
            />
            <div style={{ width: '1px', height: '34px', background: 'rgba(240,235,216,0.1)', flexShrink: 0 }} />
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                letterSpacing: '0.28em',
                color: 'rgba(240,235,216,0.32)',
                textTransform: 'uppercase',
              }}
            >
              BRASS MONKEY HOSPITALITY
            </p>
          </div>

          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.3em',
              color: 'var(--clr-red-60)',
              textTransform: 'uppercase',
            }}
          >
            RAAAAAAR CULTURE
          </p>
        </motion.div>

      </div>{/* /inner */}

      <SectionSticker
        src="/sticker3.png"
        alt="Hey Tiger sticker"
        position="bottom-right"
        size="medium"
        rotate={5}
      />

      {/* ── Scoped layout styles — ao- prefix prevents any global bleed ── */}
      <style>{`
        .ao-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: clamp(56px, 9vw, 128px);
          align-items: start;
        }
        .ao-right {
          border-left: 1px solid rgba(240,235,216,0.08);
          padding-left: clamp(32px, 5vw, 64px);
        }
        .ao-secondary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0 clamp(10px, 2vw, 20px);
        }
        @media (max-width: 900px) {
          .ao-grid {
            grid-template-columns: 1fr;
            gap: clamp(48px, 10vw, 72px);
          }
          .ao-right {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid rgba(240,235,216,0.08);
            padding-top: clamp(40px, 8vw, 56px);
          }
        }
        @media (max-width: 480px) {
          .ao-secondary {
            grid-template-columns: 1fr;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ao-grid *, .ao-right * {
            transition-duration: 0.01ms !important;
            animation-duration:  0.01ms !important;
          }
        }
      `}</style>

    </section>
  );
}
