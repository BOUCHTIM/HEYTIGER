// ARCHIVED — possibly used on secondary pages.
// Confirm usage before restoring. Do not import from active components.
// Archived: 2026-05-31
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import spaceScroll01 from '../../hitigerassets/WhatsApp Image 2026-05-20 at 11.42.37 (1).jpeg';
import spaceScroll02 from '../../hitigerassets/WhatsApp Image 2026-05-20 at 11.42.40.jpeg';
import spaceScroll03 from '../../hitigerassets/WhatsApp Image 2026-05-20 at 11.42.39.jpeg';
import spaceScroll04 from '../../hitigerassets/WhatsApp Image 2026-05-20 at 11.42.39 (1).jpeg';
import spaceScroll05 from '../../hitigerassets/WhatsApp Image 2026-05-20 at 11.42.38.jpeg';
import spaceScroll06 from '../../hitigerassets/WhatsApp Image 2026-05-20 at 11.42.39 (2).jpeg';
import spaceScroll07 from '../../hitigerassets/WhatsApp Image 2026-05-20 at 11.42.38 (2).jpeg';
import spaceScroll08 from '../../hitigerassets/WhatsApp Image 2026-05-20 at 11.42.38 (1).jpeg';
import spaceScroll09 from '../../hitigerassets/WhatsApp Image 2026-05-20 at 11.42.37.jpeg';
import spaceScroll10 from '../../hitigerassets/WhatsApp Image 2026-05-20 at 11.42.37 (2).jpeg';
import spaceScroll11 from '../../hitigerassets/WhatsApp Image 2026-05-20 at 11.42.36.jpeg';
import spaceScroll12 from '../../hitigerassets/WhatsApp Image 2026-05-20 at 11.42.36 (2).jpeg';
import spaceScroll13 from '../../hitigerassets/WhatsApp Image 2026-05-20 at 11.42.36 (1).jpeg';
import spaceScroll14 from '../../hitigerassets/WhatsApp Image 2026-05-20 at 11.42.35.jpeg';
import spaceScroll15 from '../../hitigerassets/WhatsApp Image 2026-05-20 at 11.42.35 (1).jpeg';
import posterRef01 from '../../hitigerassets/Screenshot 2026-05-20 at 11.38.49 AM.png';
import posterRef02 from '../../hitigerassets/Screenshot 2026-05-20 at 11.39.06 AM.png';
import posterRef03 from '../../hitigerassets/Screenshot 2026-05-20 at 11.39.12 AM.png';

/* ── Types ───────────────────────────────────────────────────────────── */
type SpaceId = 'den' | 'bar' | 'rooftop';

interface Hotspot {
  x: number;
  y: number;
  label: string;
  desc: string;
}

interface SpaceData {
  id: SpaceId;
  label: string;
  jpLabel: string;
  subtitle: string;
  hours: string;
  tag: string;
  description: string;
  accent: string;
  hotspots: Hotspot[];
}

/* ── Data ────────────────────────────────────────────────────────────── */
const SPACES: SpaceData[] = [
  {
    id: 'den',
    label: 'THE DEN',
    jpLabel: 'ザ・デン',
    subtitle: 'Daylight rituals',
    hours: '07:30 → 17:00',
    tag: 'BRUNCH · RAMEN · COFFEE',
    description:
      'Morning light filters through rice-paper screens. The Den is quiet fury — the city outside, warmth within. Pull up a stool. The broth has been on since midnight.',
    accent: '#faaf3f',
    hotspots: [
      { x: 20, y: 62, label: 'RAMEN BAR', desc: '8 broths, 24 hrs on the bone' },
      { x: 50, y: 45, label: 'POUR-OVER STATION', desc: 'Single-origin, brewed to order' },
      { x: 76, y: 67, label: 'TATAMI BOOTHS', desc: 'Private pods for 2–8 guests' },
    ],
  },
  {
    id: 'bar',
    label: 'THE BAR',
    jpLabel: 'バー',
    subtitle: 'The night begins here',
    hours: '17:00 → 02:00',
    tag: 'SAKE · COCKTAILS · LIVE SETS',
    description:
      'When the lights drop and the first bottle opens, The Bar reveals itself. Amber-lit. Loud with laughter. 47 sakes, a stage in the back, and a mixologist who treats every pour like it matters.',
    accent: '#e8331b',
    hotspots: [
      { x: 15, y: 52, label: 'SAKE WALL', desc: '47 labels, 3 Japanese prefectures' },
      { x: 50, y: 38, label: 'OMAKASE BAR', desc: 'Chef-guided cocktail tasting menu' },
      { x: 78, y: 58, label: 'THE STAGE', desc: 'Live music Thu–Sun from 9PM' },
    ],
  },
  {
    id: 'rooftop',
    label: 'THE ROOFTOP',
    jpLabel: 'ルーフトップ',
    subtitle: 'Above it all',
    hours: '21:00 → 04:00',
    tag: 'DJ · FIRE PITS · OPEN AIR',
    description:
      'The city stretches out below. The bass drops. Fire pits glow against the dark. Up here, Hey Tiger becomes something else — part rave, part ritual, entirely unforgettable.',
    accent: '#5a6340',
    hotspots: [
      { x: 28, y: 54, label: 'DJ BOOTH', desc: 'Residents + guest DJs nightly' },
      { x: 56, y: 36, label: 'SKY BAR', desc: 'Open-air cocktails until 4AM' },
      { x: 78, y: 64, label: 'FIRE PITS', desc: '3 communal pits, open late' },
    ],
  },
];

function getLiveSpace(hour: number): SpaceId {
  if (hour >= 7 && hour < 17) return 'den';
  if (hour >= 17 && hour < 21) return 'bar';
  return 'rooftop';
}

/* ── Photo + overlay map ─────────────────────────────────────────────── */
interface ScenePhoto {
  src: string;
  overlay: string;
  objectPosition: string;
}

const PHOTO_MAP: Record<SpaceId, ScenePhoto> = {
  den: {
    src: '/images/spaces/den.jpg',
    overlay: 'linear-gradient(135deg, rgba(26,10,4,0.38) 0%, rgba(180,72,12,0.16) 50%, rgba(26,10,4,0.52) 100%)',
    objectPosition: 'center 35%',
  },
  bar: {
    src: '/images/spaces/bar.jpg',
    overlay: 'linear-gradient(135deg, rgba(21,13,17,0.36) 0%, rgba(232,52,26,0.12) 40%, rgba(21,13,17,0.56) 100%)',
    objectPosition: 'center 40%',
  },
  rooftop: {
    src: '/images/spaces/rooftop.jpg',
    overlay: 'linear-gradient(135deg, rgba(16,11,5,0.32) 0%, rgba(74,82,64,0.14) 50%, rgba(16,11,5,0.52) 100%)',
    objectPosition: 'center 50%',
  },
};

const BG_MAP: Record<SpaceId, string> = {
  den: '#e8d9b4',
  bar: '#e8cfc8',
  rooftop: '#d8dbc8',
};

const PANEL_MAP: Record<SpaceId, string> = {
  den: '#d8ccaf',
  bar: '#edd4cc',
  rooftop: '#e4e7d4',
};

const SPACE_SCROLL_PHOTOS = [
  spaceScroll01,
  spaceScroll02,
  spaceScroll03,
  spaceScroll04,
  spaceScroll05,
  spaceScroll06,
  spaceScroll07,
  spaceScroll08,
  spaceScroll09,
  spaceScroll10,
  spaceScroll11,
  spaceScroll12,
  spaceScroll13,
  spaceScroll14,
  spaceScroll15,
] as const;

const SPACE_POSTER_REFS = [posterRef01, posterRef02, posterRef03] as const;

function SpacePhotoScene({ id }: { id: SpaceId }) {
  const photo = PHOTO_MAP[id];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Image
        src={photo.src}
        alt=""
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, 70vw"
        style={{
          objectFit: 'cover',
          objectPosition: photo.objectPosition,
          filter: 'brightness(1.12) contrast(1.06) saturate(1.12)',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, background: photo.overlay }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(60% 50% at 50% 50%, rgba(26,13,10,0) 0%, rgba(26,13,10,0.5) 72%, rgba(26,13,10,0.78) 100%)',
        }}
      />
    </div>
  );
}

const SCENE_MAP: Record<SpaceId, JSX.Element> = {
  den: <SpacePhotoScene id="den" />,
  bar: <SpacePhotoScene id="bar" />,
  rooftop: <SpacePhotoScene id="rooftop" />,
};

/* ── Main Component ──────────────────────────────────────────────────── */
export default function SpaceShowcase() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-6% 0px' });

  // Start with 'bar' to avoid hydration mismatch; update on client
  const [activeId, setActiveId] = useState<SpaceId>('bar');
  const [liveId, setLiveId] = useState<SpaceId>('bar');
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  useEffect(() => {
    const live = getLiveSpace(new Date().getHours());
    const t = window.setTimeout(() => {
      setLiveId(live);
      setActiveId(live);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const space = SPACES.find((s) => s.id === activeId)!;
  const ctaTextColor = activeId === 'den' ? 'var(--clr-void)' : 'var(--clr-cream)';
  const hoursBadgeBg = activeId === 'den' ? '#f5ecda' : activeId === 'rooftop' ? '#f2efe1' : activeId === 'bar' ? '#f5ede0' : `${space.accent}0F`;
  const hotspotBaseBg =
    activeId === 'den'
      ? '#f5ecda'
      : activeId === 'rooftop'
        ? '#f2efe1'
        : activeId === 'bar'
          ? null
          : null;

  return (
    <section
      ref={ref}
      id="space"
      aria-label="The Space"
      style={{
        background: '#e1d4b5',
        color: '#e6d8be',
        padding: 'clamp(88px, 10vw, 140px) 0 clamp(56px, 7vw, 88px)',
        overflow: 'hidden',
        position: 'relative',
        borderTop: '1px solid rgba(201,162,39,0.2)',
      }}
    >
      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65 }}
        style={{
          padding: '0 clamp(24px, 5vw, 72px)',
          marginBottom: '56px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div style={{ maxWidth: 'min(720px, 100%)' }}>
          <div className="ht-eyebrow-wrap" style={{ marginBottom: '16px' }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '0.44em',
              color: 'rgba(100,72,28,0.7)',
              fontWeight: 700,
            }}>
              THE SPACE
            </span>
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(48px, 6.8vw, 98px)',
              lineHeight: 0.93,
              letterSpacing: '-0.02em',
              color: 'var(--clr-void)',
            }}
          >
            THREE WORLDS.
            <br />
            <span style={{ color: '#faaf3f', transition: 'color 0.4s' }}>ONE ADDRESS.</span>
          </h2>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(16px, 1.6vw, 20px)',
            lineHeight: 1.75,
            color: 'rgba(13,13,13,0.7)',
            maxWidth: '42ch',
            margin: 0,
          }}
        >
          From morning ramen to 4AM rooftop sets — Hey Tiger is never the same venue twice.{' '}
          Hover the hotspots to explore each world.
        </p>
      </motion.div>

      <div style={{ padding: '0 clamp(24px, 5vw, 72px)', marginBottom: '44px' }}>
        <div
          className="space-scroll-gallery"
          aria-label="Venue gallery"
          style={{
            height: 'clamp(420px, 72vh, 820px)',
            borderRadius: '26px',
            overflowY: 'auto',
            scrollSnapType: 'y mandatory',
            border: '1px solid rgba(13,13,13,0.14)',
            background: 'rgba(13,13,13,0.04)',
            boxShadow: '0 18px 60px rgba(0,0,0,0.55)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {SPACE_SCROLL_PHOTOS.map((src, i) => (
            <div
              key={i}
              style={{
                height: 'clamp(420px, 72vh, 820px)',
                position: 'relative',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                background: '#130a07',
              }}
            >
              <Image
                src={src}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 92vw"
                style={{ objectFit: 'cover', objectPosition: 'center', filter: 'brightness(1.18) contrast(1.06) saturate(1.14)' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(10,6,5,0.26) 0%, rgba(10,6,5,0.06) 44%, rgba(10,6,5,0.38) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(55% 65% at 50% 35%, rgba(10,6,5,0) 0%, rgba(10,6,5,0.46) 82%, rgba(10,6,5,0.62) 100%)',
                }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(250,175,63,0.08) 0%, rgba(232,51,27,0.05) 38%, rgba(0,0,0,0) 70%)' }} />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '24px',
                  left: '24px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  background: 'rgba(13,13,13,0.28)',
                  border: '1px solid rgba(245,239,224,0.14)',
                  backdropFilter: 'blur(10px)',
                  pointerEvents: 'none',
                  zIndex: 4,
                }}
              >
                <Image
                  src="/BMH-logo.png"
                  alt=""
                  width={190}
                  height={76}
                  priority
                  unoptimized
                  style={{ height: '44px', width: 'auto', display: 'block', objectFit: 'contain', filter: 'brightness(0) saturate(100%) invert(1)', opacity: 0.9 }}
                />
                <span aria-hidden="true" style={{ width: '1px', height: '36px', background: 'rgba(245,239,224,0.22)' }} />
                <Image
                  src="/heytiger-logo.png"
                  alt=""
                  width={270}
                  height={88}
                  priority
                  unoptimized
                  style={{ height: '44px', width: 'auto', display: 'block', objectFit: 'contain', filter: 'brightness(0) saturate(100%) invert(1)', opacity: 0.9 }}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.34em', color: 'rgba(13,13,13,0.62)' }}>
            SCROLL THE SPACE
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.22em', color: 'rgba(13,13,13,0.52)' }}>
            01 → {String(SPACE_SCROLL_PHOTOS.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* ── Space tabs ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        role="tablist"
        aria-label="Select a space"
        style={{
          display: 'flex',
          padding: '0 clamp(24px, 5vw, 72px)',
          borderBottom: '1px solid rgba(13,13,13,0.12)',
          overflowX: 'auto',
          gap: 0,
        }}
        className="space-tabs"
      >
        {SPACES.map((s) => {
          const isActive = s.id === activeId;
          const isLive = s.id === liveId;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`space-panel-${s.id}`}
              onClick={() => {
                setActiveId(s.id);
                setActiveHotspot(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '16px 28px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                position: 'relative',
                opacity: isActive ? 1 : 0.42,
                transition: 'opacity 0.25s',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  letterSpacing: '0.28em',
                  color: isActive ? s.accent : 'rgba(13,13,13,0.55)',
                  transition: 'color 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {isLive && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: s.accent,
                      display: 'inline-block',
                      boxShadow: `0 0 6px ${s.accent}`,
                      flexShrink: 0,
                    }}
                  />
                )}
                {isLive ? 'NOW OPEN' : s.hours}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: 'clamp(20px, 2.4vw, 28px)',
                  color: isActive ? 'var(--clr-void)' : 'rgba(13,13,13,0.58)',
                  letterSpacing: '-0.01em',
                  transition: 'color 0.3s',
                  lineHeight: 1,
                }}
              >
                {s.label}
              </span>
              <span
                lang="ja"
                style={{
                  fontFamily: 'var(--font-jp)',
                  fontSize: '14px',
                  color: isActive ? s.accent : 'rgba(13,13,13,0.38)',
                  letterSpacing: '0.1em',
                  transition: 'color 0.3s',
                }}
              >
                {s.jpLabel}
              </span>
              {isActive && (
                <motion.div
                  layoutId="spaceTabLine"
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: s.accent,
                    borderRadius: '2px 2px 0 0',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </motion.div>

      {/* ── Main canvas ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          id={`space-panel-${activeId}`}
          role="tabpanel"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 400px',
            minHeight: 'clamp(360px, 52vw, 560px)',
          }}
          className="space-grid"
        >
          {/* Scene canvas */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: BG_MAP[activeId],
            }}
          >
            {/* SVG */}
            <div style={{ position: 'absolute', inset: 0 }}>
              {SCENE_MAP[activeId]}
            </div>

            {/* Hotspot dots */}
            {space.hotspots.map((hs, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${hs.x}%`,
                  top: `${hs.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                }}
              >
                {/* Pulse ring */}
                <motion.div
                  animate={{ scale: [1, 1.75], opacity: [0.55, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.55 }}
                  style={{
                    position: 'absolute',
                    inset: '-7px',
                    borderRadius: '50%',
                    border: `1.5px solid ${space.accent}`,
                    pointerEvents: 'none',
                  }}
                />
                <button
                  aria-label={hs.label}
                  onMouseEnter={() => setActiveHotspot(i)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  onFocus={() => setActiveHotspot(i)}
                  onBlur={() => setActiveHotspot(null)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: space.accent,
                    border: '2px solid rgba(245,239,224,0.25)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow:
                      activeHotspot === i
                        ? `0 0 0 4px ${space.accent}40, 0 0 20px ${space.accent}60`
                        : `0 0 12px ${space.accent}50`,
                    transform: activeHotspot === i ? 'scale(1.2)' : 'scale(1)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#fff',
                      lineHeight: 1,
                      marginTop: '-1px',
                    }}
                  >
                    +
                  </span>
                </button>

                {/* Tooltip */}
                <AnimatePresence>
                  {activeHotspot === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.94 }}
                      transition={{ duration: 0.16 }}
                      style={{
                        position: 'absolute',
                        bottom: '44px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(241,230,205,0.96)',
                        border: `1px solid ${space.accent}45`,
                        borderRadius: '8px',
                        padding: '12px 16px',
                        whiteSpace: 'nowrap',
                        backdropFilter: 'blur(16px)',
                        pointerEvents: 'none',
                        boxShadow: `0 10px 38px rgba(0,0,0,0.28), 0 0 0 1px ${space.accent}18`,
                        zIndex: 20,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '10px',
                          letterSpacing: '0.22em',
                          color: space.accent,
                          margin: '0 0 5px',
                        }}
                      >
                        {hs.label}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '12px',
                          color: 'rgba(13,13,13,0.75)',
                          margin: 0,
                          lineHeight: 1.45,
                        }}
                      >
                        {hs.desc}
                      </p>
                      {/* Arrow */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '-5px',
                          left: '50%',
                          width: '8px',
                          height: '8px',
                          background: 'rgba(241,230,205,0.96)',
                          border: `1px solid ${space.accent}45`,
                          borderTop: 'none',
                          borderLeft: 'none',
                          transform: 'translateX(-50%) rotate(45deg)',
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* JP watermark */}
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '24px',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              <span
                lang="ja"
                style={{
                  fontFamily: 'var(--font-jp)',
                  fontSize: 'clamp(52px, 8vw, 110px)',
                  color: 'rgba(245,239,224,0.48)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                {space.jpLabel}
              </span>
            </div>
          </div>

          {/* Info panel */}
          <motion.div
            key={activeId + '-info'}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.42, delay: 0.08 }}
            style={{
              padding: 'clamp(32px, 4vw, 56px) clamp(28px, 3.5vw, 48px)',
              background: PANEL_MAP[activeId],
              borderLeft: `1px solid rgba(13,13,13,0.12)`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '2px',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                letterSpacing: '0.3em',
                color: space.accent,
                marginBottom: '18px',
              }}
            >
              {space.tag}
            </span>

            <h3
              style={{
                margin: '0 0 8px',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(36px, 4.5vw, 60px)',
                lineHeight: 0.92,
                letterSpacing: '-0.02em',
                color: 'var(--clr-void)',
              }}
            >
              {space.label}
            </h3>

            <p
              lang="ja"
              style={{
                margin: '0 0 24px',
                fontFamily: 'var(--font-jp)',
                fontSize: '17px',
                letterSpacing: '0.15em',
                color: space.accent,
                opacity: 0.75,
              }}
            >
              {space.jpLabel}
            </p>

            <div
              style={{
                borderLeft: `2px solid ${space.accent}`,
                paddingLeft: '16px',
                marginBottom: '28px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(16px, 1.6vw, 20px)',
                  lineHeight: 1.78,
                  color: 'rgba(13,13,13,0.7)',
                  margin: 0,
                }}
              >
                {space.description}
              </p>
            </div>

            {/* Hours badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '24px',
                padding: '12px 16px',
                background: hoursBadgeBg,
                borderRadius: '6px',
                border: `1px solid ${space.accent}20`,
              }}
            >
              <div
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: space.accent,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  letterSpacing: '0.18em',
                  color: 'rgba(13,13,13,0.62)',
                }}
              >
                {space.subtitle}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  letterSpacing: '0.12em',
                  color: space.accent,
                  marginLeft: 'auto',
                  fontWeight: 700,
                }}
              >
                {space.hours}
              </span>
            </div>

            {/* Hotspot list (linked to canvas dots) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '28px' }}>
              {space.hotspots.map((hs, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveHotspot(i)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  style={{
                    background:
                      activeHotspot === i
                        ? `${space.accent}12`
                        : activeId === 'bar'
                          ? i === 0
                            ? '#f5eee0'
                            : '#f5ede0'
                          : hotspotBaseBg ?? 'transparent',
                    border: `1px solid ${activeHotspot === i ? space.accent + '30' : 'rgba(13,13,13,0.12)'}`,
                    borderRadius: '6px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'background 0.2s, border-color 0.2s',
                    textAlign: 'left',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: activeHotspot === i ? space.accent : 'rgba(13,13,13,0.28)',
                      flexShrink: 0,
                      transition: 'background 0.2s',
                    }}
                  />
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        letterSpacing: '0.22em',
                        color: activeHotspot === i ? space.accent : 'rgba(13,13,13,0.58)',
                        transition: 'color 0.2s',
                      }}
                    >
                      {hs.label}
                    </p>
                    <p
                      style={{
                        margin: '2px 0 0',
                        fontFamily: 'var(--font-body)',
                        fontSize: '15px',
                        color:
                          activeHotspot === i ? 'rgba(13,13,13,0.76)' : 'rgba(13,13,13,0.62)',
                        transition: 'color 0.2s',
                        lineHeight: 1.45,
                      }}
                    >
                      {hs.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Reserve CTA */}
            <a
              href="#book"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                letterSpacing: '0.18em',
                fontWeight: 800,
                color: ctaTextColor,
                background: space.accent,
                padding: '14px 28px',
                borderRadius: '40px',
                textDecoration: 'none',
                transition: 'transform 0.15s, filter 0.2s',
                alignSelf: 'flex-start',
                boxShadow: `0 10px 24px ${space.accent}33`,
                minHeight: '44px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.filter = 'brightness(0.92) saturate(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.filter = 'none';
                e.currentTarget.style.background = space.accent;
                e.currentTarget.style.color = ctaTextColor;
              }}
            >
              TAKE A SEAT IN {space.label}
              <span style={{ fontSize: '16px', lineHeight: 1 }}>→</span>
            </a>
            <div
              style={{
                marginTop: '18px',
                background: 'rgba(245,239,224,0.55)',
                border: '1px solid rgba(13,13,13,0.12)',
                borderRadius: '18px',
                padding: '18px',
                boxShadow: '0 14px 44px rgba(0,0,0,0.14)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.32em', color: 'rgba(13,13,13,0.7)', fontWeight: 800 }}>
                  POSTERS · SIGNS · PRINT
                </span>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: space.accent, boxShadow: `0 0 0 4px ${space.accent}22` }} />
              </div>
              <div
                className="space-posters"
                style={{
                  display: 'flex',
                  gap: '12px',
                  overflowX: 'auto',
                  paddingBottom: '8px',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {SPACE_POSTER_REFS.map((src, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'relative',
                      width: 'clamp(200px, 18vw, 250px)',
                      aspectRatio: '4 / 3',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: `1px solid ${space.accent}33`,
                      background: 'rgba(13,13,13,0.04)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                    }}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 80vw, 260px"
                      style={{ objectFit: 'cover', objectPosition: 'center', filter: 'contrast(1.06) saturate(1.12) brightness(1.06)' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${space.accent}0F 0%, rgba(0,0,0,0) 70%)` }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 70% at 50% 35%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.22) 100%)' }} />
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.35, backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)' }} />
                  </div>
                ))}
              </div>
            </div>
            {activeId === 'bar' && (
              <div
                style={{
                  marginTop: '28px',
                  background: '#F5EFE0',
                  borderRadius: '16px',
                  padding: 'clamp(22px, 2.5vw, 36px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '20px',
                  overflow: 'hidden',
                  cursor: 'default',
                  boxShadow: '0 10px 32px rgba(0,0,0,0.32)',
                  minHeight: 'clamp(320px, 32vw, 440px)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(11px, 1.05vw, 14px)', letterSpacing: '0.3em', color: '#150D11', fontWeight: 800 }}>
                    TATTOO FLASH
                  </span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#150D11', opacity: 0.5 }} />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 'clamp(200px, 23vw, 290px)',
                    aspectRatio: '1 / 1.15',
                    borderRadius: '18px',
                    border: '2px solid rgba(21,13,17,0.22)',
                    background: 'rgba(21,13,17,0.06)',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '12px',
                      letterSpacing: '0.28em',
                      fontWeight: 900,
                      color: '#150D11',
                      opacity: 0.85,
                      lineHeight: 1.2,
                    }}>
                      GIVE ME MORE<br />POISON AND AFFECTION
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '10px',
                      letterSpacing: '0.3em',
                      fontWeight: 800,
                      color: '#150D11',
                      opacity: 0.7,
                    }}>
                      HEY TIGER · FLASH №7
                    </div>
                  </div>
                </div>
                <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 'clamp(11px, 1vw, 13px)', letterSpacing: '0.22em', color: 'rgba(21,13,17,0.65)', textAlign: 'center', fontWeight: 600 }}>
                  More poison. More affection.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .space-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: 280px auto;
          }
          .space-tabs {
            scrollbar-width: none;
          }
          .space-tabs::-webkit-scrollbar {
            display: none;
          }
          .space-scroll-gallery {
            scrollbar-width: none;
          }
          .space-scroll-gallery::-webkit-scrollbar {
            display: none;
          }
          .space-posters {
            scrollbar-width: none;
          }
          .space-posters::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
