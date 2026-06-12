'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { KeyboardEvent } from 'react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Room = {
  id: string;
  num: string;
  name: string;
  jp: string;
  line: string;
  mood: string;
  photo: string;
  position: string;
  accent: string;
  grade: string;
  tint: number;
  glow: string;
};

/* Five scenes, one house. Each room carries its own temperature —
   grade/tint/glow tune the photo toward that mood without leaving
   the red–brass–bone family. */
const ROOMS: Room[] = [
  {
    id: 'bar',
    num: '01',
    name: 'THE BAR',
    jp: 'バー',
    line: 'Low light, long pours. The night starts here, whether you meant it to or not.',
    mood: 'INTIMATE · ELECTRIC',
    photo: '/images/spaces/bar.jpg',
    position: 'center 55%',
    accent: '#C83D20',
    grade: 'contrast(1.1) saturate(1.05) brightness(0.78) sepia(0.08)',
    tint: 0.16,
    glow: 'radial-gradient(70% 60% at 18% 78%, #C83D2052 0%, transparent 70%)',
  },
  {
    id: 'dining',
    num: '02',
    name: 'THE DINING ROOM',
    jp: '食堂',
    line: 'Steam over wood, voices shoulder to shoulder. The warmest room in the house.',
    mood: 'WARM · GROUNDED',
    photo: '/images/spaces/dining.jpg',
    position: 'center',
    accent: '#C17B3F',
    grade: 'contrast(1.06) saturate(1.02) brightness(0.8)',
    tint: 0.18,
    glow: 'radial-gradient(70% 55% at 32% 72%, #C17B3F4A 0%, transparent 70%)',
  },
  {
    id: 'rooftop',
    num: '03',
    name: 'THE ROOFTOP',
    jp: '屋上',
    line: 'Open sky, the city humming underneath. After midnight, the pulse moves up.',
    mood: 'OPEN-AIR · NOCTURNAL',
    photo: '/images/spaces/rooftop.jpg',
    position: 'center 40%',
    accent: '#CC4A2C',
    grade: 'contrast(1.12) saturate(0.92) brightness(0.74)',
    tint: 0.12,
    glow: 'radial-gradient(80% 55% at 70% 18%, #CC4A2C3D 0%, transparent 72%)',
  },
  {
    id: 'den',
    num: '04',
    name: "THE TIGER'S DEN",
    jp: '虎の穴',
    line: 'Behind a door most guests never find. Curated, sealed, and yours alone.',
    mood: 'LACQUERED · SECRETIVE',
    photo: '/images/spaces/den.jpg',
    position: 'center',
    accent: '#B22D12',
    grade: 'contrast(1.16) saturate(0.9) brightness(0.62)',
    tint: 0.22,
    glow: 'radial-gradient(60% 50% at 50% 88%, #B22D1247 0%, transparent 70%)',
  },
  {
    id: 'terrace',
    num: '05',
    name: 'THE TERRACE',
    jp: 'テラス',
    line: 'Lantern light and slow smoke. The room where the night finally exhales.',
    mood: 'AIRY · LUMINOUS',
    photo: '/images/spaces/terrace-night.jpg',
    position: 'center 60%',
    accent: '#C8B890',
    grade: 'contrast(1.05) saturate(0.88) brightness(0.85)',
    tint: 0.12,
    glow: 'radial-gradient(75% 55% at 60% 30%, #C8B89030 0%, transparent 72%)',
  },
];

/* ─── Motion grammar ──────────────────────────────────────────────── */

const frameVariants = (rm: boolean): Variants => ({
  enter: rm ? { opacity: 0 } : { opacity: 0, scale: 1.045 },
  center: {
    opacity: 1,
    scale: 1,
    transition: rm
      ? { duration: 0.25 }
      : { duration: 0.95, ease: EASE, staggerChildren: 0.07, delayChildren: 0.12 },
  },
  exit: rm
    ? { opacity: 0, transition: { duration: 0.2 } }
    : { opacity: 0, scale: 1.012, transition: { duration: 0.55, ease: EASE } },
});

const itemVariants = (rm: boolean): Variants => ({
  enter: rm ? { opacity: 0 } : { opacity: 0, y: 14 },
  center: { opacity: 1, y: 0, transition: { duration: rm ? 0.25 : 0.6, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
});

/* ─── Scene chrome ────────────────────────────────────────────────── */

function CornerBrackets() {
  const base = {
    position: 'absolute' as const,
    width: '22px',
    height: '22px',
    borderColor: 'rgba(193,123,63,0.55)',
    borderStyle: 'solid',
    borderWidth: 0,
    pointerEvents: 'none' as const,
    zIndex: 4,
  };
  return (
    <div aria-hidden="true">
      <span style={{ ...base, top: 14, left: 14, borderTopWidth: 1, borderLeftWidth: 1 }} />
      <span style={{ ...base, top: 14, right: 14, borderTopWidth: 1, borderRightWidth: 1 }} />
      <span style={{ ...base, bottom: 14, left: 14, borderBottomWidth: 1, borderLeftWidth: 1 }} />
      <span style={{ ...base, bottom: 14, right: 14, borderBottomWidth: 1, borderRightWidth: 1 }} />
    </div>
  );
}

/* One scene — photo, grade, glow, title card. `mode` decides whether it
   lives inside the desktop crossfade stage (absolute, enter/exit) or the
   mobile stack (static, already visible). */
function SceneFrame({
  room,
  total,
  reduceMotion,
  mode,
}: {
  room: Room;
  total: number;
  reduceMotion: boolean;
  mode: 'stage' | 'card';
}) {
  const stage = mode === 'stage';
  const item = itemVariants(reduceMotion);

  return (
    <motion.div
      variants={frameVariants(reduceMotion)}
      initial={stage ? 'enter' : 'center'}
      animate="center"
      exit={stage ? 'exit' : undefined}
      style={{
        position: stage ? 'absolute' : 'relative',
        inset: stage ? 0 : undefined,
        aspectRatio: stage ? undefined : '4 / 3',
        overflow: 'hidden',
        background: 'var(--clr-void)',
      }}
    >
      {/* Photo, graded per room */}
      <Image
        src={room.photo}
        alt=""
        aria-hidden="true"
        fill
        unoptimized
        sizes={stage ? '(max-width: 900px) 100vw, 1360px' : '100vw'}
        style={{ objectFit: 'cover', objectPosition: room.position, filter: room.grade }}
      />

      {/* Color grade — accent multiply tint */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: room.accent,
          mixBlendMode: 'multiply',
          opacity: room.tint,
          pointerEvents: 'none',
        }}
      />
      {/* Practical-light glow — additive */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: room.glow,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      {/* Vignette + floor shadow for legibility */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(13,11,10,0.32) 0%, rgba(13,11,10,0) 30%, rgba(13,11,10,0) 48%, rgba(13,11,10,0.86) 100%), radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(13,11,10,0.5) 100%)',
          pointerEvents: 'none',
        }}
      />
      <div aria-hidden="true" className="htsp-grain" />

      {/* Scene index — top right */}
      <motion.span
        variants={item}
        style={{
          position: 'absolute',
          top: 'clamp(16px, 2vw, 26px)',
          right: 'clamp(18px, 2.4vw, 32px)',
          fontFamily: 'var(--font-body)',
          fontSize: '10px',
          fontWeight: 800,
          letterSpacing: '0.42em',
          color: 'rgba(193,123,63,0.85)',
          zIndex: 3,
        }}
      >
        {room.num} / {String(total).padStart(2, '0')}
      </motion.span>

      {/* Ghost kanji — large, recessed */}
      <motion.span
        variants={item}
        lang="ja"
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: 'clamp(14px, 2.4vw, 36px)',
          bottom: 'clamp(10px, 2vw, 28px)',
          fontFamily: 'var(--font-jp-rough)',
          fontSize: 'clamp(56px, 9vw, 132px)',
          lineHeight: 1,
          color: `${room.accent}3D`,
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {room.jp}
      </motion.span>

      {/* Title card — bottom left */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: 'clamp(20px, 3.2vw, 44px)',
          zIndex: 3,
        }}
      >
        <motion.p
          variants={item}
          style={{
            margin: '0 0 10px',
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            fontWeight: 900,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: room.accent,
          }}
        >
          {room.mood}
        </motion.p>
        <motion.h3
          variants={item}
          style={{
            margin: '0 0 12px',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: stage ? 'clamp(30px, 4.6vw, 64px)' : 'clamp(22px, 6.4vw, 32px)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            color: 'var(--clr-cream)',
            textTransform: 'uppercase',
            textShadow: '0 2px 30px rgba(13,11,10,0.6)',
          }}
        >
          {room.name}
        </motion.h3>
        <motion.p
          variants={item}
          style={{
            margin: 0,
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(13px, 1.1vw, 15px)',
            letterSpacing: '0.02em',
            lineHeight: 1.7,
            color: 'rgba(240,235,216,0.82)',
            maxWidth: '42ch',
          }}
        >
          {room.line}
        </motion.p>
      </div>

      <CornerBrackets />
    </motion.div>
  );
}

/* ─── Section ─────────────────────────────────────────────────────── */

export default function SpaceSection({ reduceMotion }: { reduceMotion: boolean }) {
  const [active, setActive] = useState(0);
  const room = ROOMS[active];

  const onRailKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (active + 1) % ROOMS.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (active - 1 + ROOMS.length) % ROOMS.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = ROOMS.length - 1;
    if (next !== null) {
      e.preventDefault();
      setActive(next);
      document.getElementById(`htsp-tab-${next}`)?.focus();
    }
  };

  return (
    <section
      id="space"
      aria-label="The Space"
      style={{
        background: 'var(--clr-void)',
        padding: 'var(--space-section-y) var(--space-section-x)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ghost kanji backdrop */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '-4%',
          top: '3%',
          fontFamily: 'var(--font-jp)',
          fontWeight: 900,
          fontSize: 'clamp(200px, 30vw, 520px)',
          lineHeight: 1,
          color: 'rgba(240,235,216,0.03)',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        間
      </div>

      <div style={{ maxWidth: '1360px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Intro */}
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ marginBottom: 'clamp(36px, 5vw, 60px)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-label)',
                letterSpacing: 'var(--tracking-ultra)',
                color: 'var(--clr-red-80)',
                fontWeight: 800,
              }}
            >
              THE SPACE · <span lang="ja">空間</span> · MOTOR CITY
            </span>
            <div
              aria-hidden="true"
              style={{
                height: '1px',
                flex: 1,
                background: 'linear-gradient(90deg, rgba(193,123,63,0.5), transparent)',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'var(--text-heading-xl)',
                lineHeight: 1,
                letterSpacing: 'var(--tracking-tight)',
                color: 'var(--clr-red)',
                textTransform: 'uppercase',
              }}
            >
              FIVE ROOMS.
              <span style={{ display: 'block', marginTop: '0.1em', color: 'var(--clr-cream)' }}>ONE ADDRESS.</span>
            </h2>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(14px, 1.2vw, 17px)',
                letterSpacing: '0.02em',
                lineHeight: 1.8,
                color: 'rgba(240,235,216,0.7)',
                maxWidth: '40ch',
                paddingBottom: '6px',
              }}
            >
              Every room runs at its own temperature. Walk the house — heat, warmth, air, secrecy, release — and choose where the night takes you.
            </p>
          </div>
        </motion.div>

        {/* Desktop — dominant stage + chapter rail */}
        <motion.div
          className="htsp-stage-wrap"
          initial={reduceMotion ? {} : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8% 0px' }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        >
          <div
            role="tabpanel"
            id={`htsp-panel-${active}`}
            aria-labelledby={`htsp-tab-${active}`}
            tabIndex={0}
            className="htsp-stage"
            style={{
              position: 'relative',
              aspectRatio: '16 / 9',
              overflow: 'hidden',
              border: '1px solid var(--border-structural)',
              background: 'var(--clr-void)',
            }}
          >
            <AnimatePresence initial={false}>
              <SceneFrame key={room.id} room={room} total={ROOMS.length} reduceMotion={reduceMotion} mode="stage" />
            </AnimatePresence>
          </div>

          {/* Chapter rail */}
          <div
            role="tablist"
            aria-label="Hey Tiger rooms"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${ROOMS.length}, 1fr)`,
              borderLeft: '1px solid var(--border-structural)',
              borderRight: '1px solid var(--border-structural)',
              borderBottom: '1px solid var(--border-structural)',
            }}
          >
            {ROOMS.map((r, i) => {
              const isActive = i === active;
              return (
                <button
                  key={r.id}
                  role="tab"
                  id={`htsp-tab-${i}`}
                  aria-selected={isActive}
                  aria-controls={`htsp-panel-${i}`}
                  tabIndex={isActive ? 0 : -1}
                  className="htsp-chapter"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onKeyDown={onRailKeyDown}
                  style={{
                    appearance: 'none',
                    background: isActive ? 'rgba(240,235,216,0.035)' : 'transparent',
                    border: 'none',
                    borderRight: i < ROOMS.length - 1 ? '1px solid var(--border-structural)' : 'none',
                    padding: 'clamp(14px, 1.6vw, 20px) clamp(12px, 1.4vw, 18px) clamp(16px, 1.8vw, 22px)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    position: 'relative',
                    transition: 'background 0.35s ease',
                  }}
                >
                  {/* Accent overline — the only moving part of the rail */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: r.accent,
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left center',
                      transition: reduceMotion ? 'none' : 'transform 0.55s cubic-bezier(0.22,1,0.36,1)',
                    }}
                  />
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-body)',
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.38em',
                      color: isActive ? r.accent : 'rgba(193,123,63,0.55)',
                      marginBottom: '8px',
                      transition: 'color 0.35s ease',
                    }}
                  >
                    {r.num}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(12px, 1.15vw, 16px)',
                      fontWeight: 900,
                      letterSpacing: '0.01em',
                      lineHeight: 1.1,
                      color: isActive ? 'var(--clr-cream)' : 'rgba(240,235,216,0.45)',
                      textTransform: 'uppercase',
                      transition: 'color 0.35s ease',
                    }}
                  >
                    {r.name}
                  </span>
                  <span
                    lang="ja"
                    style={{
                      display: 'block',
                      marginTop: '6px',
                      fontFamily: 'var(--font-jp)',
                      fontSize: '11px',
                      letterSpacing: '0.14em',
                      color: isActive ? 'rgba(240,235,216,0.55)' : 'rgba(240,235,216,0.25)',
                      transition: 'color 0.35s ease',
                    }}
                  >
                    {r.jp}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Mobile — stacked scenes */}
        <div className="htsp-stack" style={{ flexDirection: 'column', gap: '14px' }}>
          {ROOMS.map((r) => (
            <motion.div
              key={r.id}
              initial={reduceMotion ? {} : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-6% 0px' }}
              transition={{ duration: 0.65, ease: EASE }}
              style={{ border: '1px solid var(--border-structural)' }}
            >
              <SceneFrame room={r} total={ROOMS.length} reduceMotion={reduceMotion} mode="card" />
            </motion.div>
          ))}
        </div>

        {/* Epilogue — the Den, privately */}
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
          style={{
            marginTop: 'clamp(40px, 5.5vw, 64px)',
            padding: 'clamp(22px, 3vw, 34px) clamp(20px, 3.4vw, 44px)',
            background: 'rgba(18,13,20,0.6)',
            border: '1px solid var(--border-structural)',
            borderLeft: '4px solid #B22D12',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: '58ch' }}>
            <p
              style={{
                margin: '0 0 8px',
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                fontWeight: 900,
                letterSpacing: '0.4em',
                color: 'rgba(193,123,63,0.85)',
                textTransform: 'uppercase',
              }}
            >
              PRIVATE EVENTS · <span lang="ja">虎の穴</span>
            </p>
            <p
              style={{
                margin: '0 0 10px',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(20px, 2.4vw, 30px)',
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                color: 'var(--clr-cream)',
                textTransform: 'uppercase',
              }}
            >
              THE TIGER&apos;S DEN IS YOURS.
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(13px, 1.05vw, 14px)',
                letterSpacing: '0.02em',
                lineHeight: 1.7,
                color: 'rgba(240,235,216,0.65)',
              }}
            >
              Fully private bookings, curated menus, bespoke audio. Up to 18 seated, 25 standing — book two weeks ahead for weekends.
            </p>
          </div>
          <a
            href="mailto:hello@heytiger.ae?subject=Tiger%27s%20Den%20%E2%80%94%20%5BDate%5D%20enquiry"
            aria-label="Enquire about booking the Tiger's Den for a private event"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-label)',
              fontWeight: 900,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--clr-void)',
              background: 'var(--clr-red)',
              padding: '16px 34px',
              minHeight: '44px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              transition: 'background var(--dur-fast) var(--ease-standard)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--clr-red-dim)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--clr-red)';
            }}
          >
            BOOK THE DEN
          </a>
        </motion.div>
      </div>

      <style>{`
        .htsp-stack { display: none; }
        @media (max-width: 900px) {
          .htsp-stage-wrap { display: none !important; }
          .htsp-stack { display: flex !important; }
        }
        .htsp-chapter:focus-visible {
          outline: 2px solid var(--clr-red);
          outline-offset: -2px;
        }
        .htsp-chapter:focus:not(:focus-visible) { outline: none; }
        .htsp-stage:focus-visible {
          outline: 2px solid var(--clr-red);
          outline-offset: 3px;
        }
        .htsp-grain {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          opacity: 0.05;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>
    </section>
  );
}
