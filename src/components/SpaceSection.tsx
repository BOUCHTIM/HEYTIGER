'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const SPACES = [
  { name: 'THE BAR',           jp: 'バー',   desc: 'Where strangers become regulars. 47 sake labels, house-crafted cocktails, and the best seat in Motor City. The pulse of every night.',                                             photo: '/images/spaces/bar.jpg',          tag: 'GROUND FLOOR', mood: 'INTIMATE · ELECTRIC',  bestFor: 'Best for cocktails & late-night energy' },
  { name: 'THE DINING ROOM',   jp: '食堂',   desc: 'Family-style tables by day, intimate izakaya by night. Where the chef\'s vision meets the guest\'s appetite. The soul of Hey Tiger.',                                               photo: '/images/spaces/dining.jpg',       tag: 'GROUND FLOOR', mood: 'WARM · CONVIVIAL',    bestFor: 'Best for dinner reservations & group meals' },
  { name: 'THE ROOFTOP',       jp: '屋上',   desc: 'Dubai skyline as a backdrop. DJ sets. Open-air energy. The party moves up here after midnight and doesn\'t stop until the sun threatens to rise.',                                  photo: '/images/spaces/rooftop.jpg',      tag: 'ROOFTOP',      mood: 'OPEN-AIR · WILD',     bestFor: 'Best for open-air drinks & weekend nights' },
  { name: "THE TIGER'S DEN",   jp: '虎の穴', desc: 'Exclusive private bookings, fully curated menus, and bespoke audio — the Den is yours and yours alone. No compromises, no sharing.',                                               photo: '/images/spaces/den.jpg',          tag: 'PRIVATE',      mood: 'EXCLUSIVE · CURATED', bestFor: 'Best for private events & celebrations' },
  { name: 'THE TERRACE',       jp: 'テラス', desc: 'Shaded outdoor seating kissed by the Dubai breeze by day, lantern-lit by night. All the street energy, none of the noise.',                                                   photo: '/images/spaces/terrace-night.jpg', tag: 'OUTDOOR',     mood: 'BREEZY · LUMINOUS',   bestFor: 'Best for brunch & daytime hangs' },
];

const PHOTO_STRIP = [
  { src: '/images/spaces/bar.jpg',          label: 'The Bar',        spaceIndex: 0 },
  { src: '/images/spaces/dining.jpg',       label: 'Dining Room',    spaceIndex: 1 },
  { src: '/images/spaces/rooftop.jpg',      label: 'Rooftop',        spaceIndex: 2 },
  { src: '/images/spaces/den.jpg',          label: "Tiger's Den",    spaceIndex: 3 },
  { src: '/images/spaces/terrace-night.jpg',label: 'Terrace',        spaceIndex: 4 },
  { src: '/images/spaces/corridor.jpg',     label: 'Corridor' },
  { src: '/images/spaces/bar-side.jpg',     label: 'Bar Detail' },
  { src: '/images/spaces/lobby.jpg',        label: 'Lobby' },
  { src: '/images/spaces/dining-night.jpg', label: 'Dining · Night' },
  { src: '/images/spaces/entrance.jpg',     label: 'Entrance' },
  { src: '/images/spaces/terrace-day.jpg',  label: 'Terrace · Day' },
  { src: '/images/brand/interiors/p14_039_1143x1714.png', label: 'Interior' },
];

export default function SpaceSection({ reduceMotion }: { reduceMotion: boolean }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = SPACES[activeIdx];
  const panelRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!panelRef.current?.contains(document.activeElement)) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(SPACES.length - 1, i + 1)); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(0, i - 1)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) setActiveIdx(i => Math.min(SPACES.length - 1, i + 1));
      else        setActiveIdx(i => Math.max(0, i - 1));
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="space"
      aria-label="The Space"
      style={{
        background: 'var(--clr-void)',
        padding: 'var(--space-section-y) var(--space-section-x)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Ghost kanji backdrop */}
      <div aria-hidden="true" style={{
        position: 'absolute', right: '-4%', top: '5%',
        fontFamily: 'var(--font-jp)', fontWeight: 900,
        fontSize: 'clamp(200px, 32vw, 560px)', lineHeight: 1,
        color: 'rgba(240,235,216,0.03)', userSelect: 'none', pointerEvents: 'none',
        zIndex: 0,
      }}>間</div>

      <div style={{ maxWidth: '1360px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'end', marginBottom: 'clamp(40px, 6vw, 72px)' }} className="ht-space-title-row">
          <motion.div
            initial={reduceMotion ? {} : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ maxWidth: 'min(720px, 100%)' }}
          >
            <div style={{ marginBottom: '20px' }}>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)',
                letterSpacing: 'var(--tracking-ultra)', color: 'var(--clr-red-80)', fontWeight: 700,
              }}>
                THE SPACE · <span lang="ja">空間</span> · MOTOR CITY
              </span>
            </div>
            <h2 style={{
              margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'var(--text-heading-xl)', lineHeight: 0.94,
              letterSpacing: 'var(--tracking-tight)', color: 'var(--clr-red)',
              display: 'inline-block',
              animation: reduceMotion ? 'none' : 'neonFlickerRed 4.5s infinite 0.4s',
            }}>
              FIVE ROOMS.<br />
              <span style={{ color: 'var(--clr-cream)' }}>ONE ADDRESS.</span>
            </h2>
            <div lang="ja" style={{
              marginTop: 'clamp(16px, 2vw, 28px)', fontFamily: 'var(--font-jp)',
              fontSize: 'var(--text-jp-display)', fontWeight: 700,
              color: 'var(--clr-red)', letterSpacing: '0.08em',
            }}>おいトラ</div>
          </motion.div>
          <motion.p
            initial={reduceMotion ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 1.35vw, 19px)',
              letterSpacing: '0.02em', lineHeight: 1.85,
              color: 'rgba(240,235,216,0.72)', maxWidth: '52ch',
              margin: 0, paddingBottom: '20px',
            }}
          >
            Motor City Club House, Dubai. Every room has its own personality.
            All connected by one idea — make you feel at home.
            <br /><br />
            <span style={{ color: 'var(--clr-red)', fontWeight: 600 }}>Weekend brunch:</span> Sat &amp; Sun from 11AM — Terrace and Dining Room. Izakaya &amp; cocktails nightly.
          </motion.p>
        </div>

        {/* Showcase */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 280px) 1fr', gap: 'clamp(24px, 4vw, 52px)', alignItems: 'start' }} className="ht-space-grid">

          {/* O4: full ARIA tab pattern — role=tablist/tab/tabpanel */}
          <div
            role="tablist"
            aria-label="Hey Tiger spaces"
            style={{
              display: 'flex', flexDirection: 'column', gap: '2px',
              background: 'var(--clr-void)', padding: '6px',
              border: '1px solid var(--border-structural)',
            }}
          >
            {SPACES.map((space, i) => (
              <button
                key={space.name}
                role="tab"
                id={`spaces-tab-${i}`}
                aria-selected={activeIdx === i}
                aria-controls={`spaces-panel-${i}`}
                tabIndex={activeIdx === i ? 0 : -1}
                onClick={() => setActiveIdx(i)}
                onKeyDown={e => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); setActiveIdx(j => (j + 1) % SPACES.length); }
                  if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); setActiveIdx(j => (j - 1 + SPACES.length) % SPACES.length); }
                  if (e.key === 'Home') { e.preventDefault(); setActiveIdx(0); }
                  if (e.key === 'End')  { e.preventDefault(); setActiveIdx(SPACES.length - 1); }
                }}
                className="spaces-tab-btn"
                style={{
                  background: activeIdx === i ? 'var(--clr-red)' : 'transparent',
                  border: 'none',
                  borderLeft: activeIdx === i ? '5px solid #FFFFFF' : '5px solid rgba(240,235,216,0.1)',
                  padding: '18px 20px', cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.2s, border-color 0.2s',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => { if (activeIdx !== i) { e.currentTarget.style.borderLeftColor = 'var(--clr-red)'; e.currentTarget.style.background = 'var(--clr-red-10)'; } }}
                onMouseLeave={e => { if (activeIdx !== i) { e.currentTarget.style.borderLeftColor = 'rgba(240,235,216,0.1)'; e.currentTarget.style.background = 'transparent'; } }}
              >
                {/* CC1: active tab uses #FFFFFF on var(--clr-red) = 4.56:1 ✅ */}
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)',
                  fontWeight: 800, letterSpacing: '0.36em',
                  color: activeIdx === i ? 'rgba(255,255,255,0.85)' : 'rgba(240,235,216,0.35)',
                  margin: '0 0 4px', transition: 'color var(--dur-fast) var(--ease-standard)',
                }}>{space.tag}</p>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(15px, 1.8vw, 19px)',
                  fontWeight: 900, letterSpacing: 'var(--tracking-tight)',
                  color: activeIdx === i ? '#FFFFFF' : 'rgba(240,235,216,0.85)',
                  margin: '0 0 5px', transition: 'color var(--dur-fast) var(--ease-standard)',
                }}>{space.name}</p>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)',
                  fontWeight: 700, letterSpacing: '0.28em',
                  color: activeIdx === i ? 'rgba(255,255,255,0.75)' : 'var(--clr-cream-30)',
                  margin: 0, transition: 'color var(--dur-fast) var(--ease-standard)',
                }}>{space.mood}</p>
              </button>
            ))}
          </div>

          {/* Photo panel — O4: tabpanel role */}
          <div
            ref={panelRef}
            role="tabpanel"
            id={`spaces-panel-${activeIdx}`}
            aria-labelledby={`spaces-tab-${activeIdx}`}
            tabIndex={0}
            style={{ position: 'relative' }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                id={`space-${activeIdx}`}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.03, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', borderRadius: 0 }}
              >
                {/* SR2: alt="" + aria-hidden — h3 below carries the accessible name */}
                <Image
                  src={active.photo} alt="" aria-hidden="true" fill unoptimized
                  sizes="(max-width: 768px) 100vw, 70vw"
                  style={{ objectFit: 'cover', objectPosition: 'center', filter: 'contrast(1.08) saturate(0.88) brightness(0.82)' }}
                />
                {/* Amber wood photo overlay */}
                <div aria-hidden="true" style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: '#C17B3F',
                  mixBlendMode: 'multiply',
                  opacity: 0.28,
                }} />
                {/* Bottom overlay for text readability */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'rgba(18,13,20,0.7)', pointerEvents: 'none' }} />

                {/* Room counter */}
                <div style={{
                  position: 'absolute', top: '20px', right: '20px',
                  background: 'var(--clr-void)',
                  border: '1px solid var(--border-structural)',
                  padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 800, letterSpacing: '0.36em', color: 'rgba(240,235,216,0.45)' }}>ROOM</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 900, color: 'var(--clr-red)', lineHeight: 1 }}>{String(activeIdx + 1).padStart(2, '0')}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 700, letterSpacing: 'var(--tracking-wide)', color: 'var(--clr-cream-30)' }}>/ {SPACES.length}</span>
                </div>

                {/* Info overlay */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(24px, 4vw, 40px)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
                    <div>
                      <span style={{
                        display: 'inline-block',
                        fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)',
                        fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase',
                        color: 'var(--clr-void)', background: 'var(--clr-red)',
                        padding: '5px 12px', marginBottom: '12px',
                      }}>{active.bestFor}</span>
                      <h3 style={{
                        fontFamily: 'var(--font-display)', fontWeight: 900,
                        fontSize: 'clamp(26px, 3.8vw, 48px)',
                        letterSpacing: '-0.02em', color: 'var(--clr-cream)',
                        margin: '0 0 10px', lineHeight: 0.95,
                      }}>{active.name}</h3>
                      <p style={{
                        fontFamily: 'var(--font-body)', fontSize: 'clamp(14px, 1.2vw, 16px)',
                        letterSpacing: '0.02em', lineHeight: 1.8,
                        color: 'rgba(240,235,216,0.8)',
                        margin: 0, maxWidth: '52ch',
                      }}>{active.desc}</p>
                    </div>
                    <span lang="ja" style={{
                      fontFamily: 'var(--font-jp-rough)', fontSize: 'clamp(34px, 5vw, 60px)',
                      color: 'rgba(200,61,32,0.75)', letterSpacing: 'var(--tracking-tight)',
                      flexShrink: 0, lineHeight: 1,
                    }}>{active.jp}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Nav dots + arrows */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {/* O1: .space-nav-dot ::after gives 44×44 hit area */}
                {SPACES.map((_, i) => (
                  <button key={i} onClick={() => setActiveIdx(i)} aria-label={`Go to ${SPACES[i].name}`}
                    className="space-nav-dot"
                    style={{
                      width: activeIdx === i ? '24px' : '6px', height: '6px', borderRadius: 0,
                      background: activeIdx === i ? 'var(--clr-red)' : 'rgba(240,235,216,0.2)',
                      border: 'none', cursor: 'pointer',
                      transition: 'width 0.28s, background 0.22s', padding: 0,
                    }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
                  disabled={activeIdx === 0}
                  aria-label="Previous space"
                  style={{ background: 'rgba(240,235,216,0.05)', border: '1px solid var(--border-structural)', color: 'var(--clr-cream)', width: '44px', height: '44px', borderRadius: 0, cursor: activeIdx === 0 ? 'not-allowed' : 'pointer', opacity: activeIdx === 0 ? 0.35 : 1, fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background var(--dur-fast) var(--ease-standard)' }}
                  onMouseEnter={e => { if (activeIdx !== 0) e.currentTarget.style.background = 'var(--clr-red-10)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(240,235,216,0.05)'; }}
                >←</button>
                <button
                  onClick={() => setActiveIdx(i => Math.min(SPACES.length - 1, i + 1))}
                  disabled={activeIdx === SPACES.length - 1}
                  aria-label="Next space"
                  style={{ background: 'rgba(240,235,216,0.05)', border: '1px solid var(--border-structural)', color: 'var(--clr-cream)', width: '44px', height: '44px', borderRadius: 0, cursor: activeIdx === SPACES.length - 1 ? 'not-allowed' : 'pointer', opacity: activeIdx === SPACES.length - 1 ? 0.35 : 1, fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background var(--dur-fast) var(--ease-standard)' }}
                  onMouseEnter={e => { if (activeIdx !== SPACES.length - 1) e.currentTarget.style.background = 'var(--clr-red-10)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(240,235,216,0.05)'; }}
                >→</button>
              </div>
            </div>
          </div>
        </div>

        {/* Photo strip — single curated row */}
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ marginTop: 'clamp(48px, 7vw, 88px)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', fontWeight: 800, letterSpacing: 'var(--tracking-ultra)', color: 'var(--clr-red-80)', margin: 0 }}>A SELECTION OF SPACES</p>
            <div style={{ height: '1px', flex: 1, marginLeft: '20px', background: 'var(--border-structural)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }} className="ht-photo-strip">
            {PHOTO_STRIP.map(({ src, label, spaceIndex }, i) => {
              const isActive = spaceIndex === activeIdx;
              return (
                <motion.div
                  key={src}
                  initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  whileHover={reduceMotion ? {} : { y: -6, zIndex: 2 }}
                  onClick={() => {
                    if (typeof spaceIndex === 'number') {
                      setActiveIdx(spaceIndex);
                      document
                        .getElementById(`space-${spaceIndex}`)
                        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  style={{
                    position: 'relative', aspectRatio: '3/4', overflow: 'hidden',
                    cursor: typeof spaceIndex === 'number' ? 'pointer' : 'default', borderRadius: 0,
                    border: isActive ? '2px solid var(--clr-red)' : '1px solid var(--border-structural)',
                    boxShadow: '0 14px 34px rgba(0,0,0,0.4)',
                    transition: 'border-color 0.3s',
                  }}
                  onMouseEnter={e => {
                    if (isActive) return;
                    e.currentTarget.style.borderColor = 'var(--clr-red)';
                    const img = e.currentTarget.querySelector('img');
                    if (img) (img as HTMLElement).style.filter = 'contrast(1.04) saturate(1) brightness(1)';
                    const frame = e.currentTarget.querySelector('[data-frame]') as HTMLElement | null;
                    if (frame) frame.style.opacity = '0.6';
                  }}
                  onMouseLeave={e => {
                    if (isActive) return;
                    e.currentTarget.style.borderColor = 'var(--border-structural)';
                    const img = e.currentTarget.querySelector('img');
                    if (img) (img as HTMLElement).style.filter = 'contrast(1.04) saturate(0.96) brightness(0.82)';
                    const frame = e.currentTarget.querySelector('[data-frame]') as HTMLElement | null;
                    if (frame) frame.style.opacity = '0';
                  }}
                >
                  <Image src={src} alt={`${label} — Hey Tiger, Motor City Dubai`} fill unoptimized sizes="17vw"
                    style={{ objectFit: 'cover', objectPosition: 'center', filter: isActive ? 'contrast(1.04) saturate(1) brightness(1)' : 'contrast(1.04) saturate(0.96) brightness(0.82)', transition: 'filter 0.4s' }} />
                  {/* Bottom legibility gradient */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,13,20,0) 40%, rgba(18,13,20,0.82) 100%)', pointerEvents: 'none' }} />
                  {/* Hover/Active accent frame */}
                  <span data-frame aria-hidden="true" style={{ position: 'absolute', inset: '8px', border: '1px solid var(--clr-red)', opacity: isActive ? 0.8 : 0, transition: 'opacity 0.3s', pointerEvents: 'none' }} />
                  {/* Index */}
                  <span style={{ position: 'absolute', top: '10px', left: '12px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 800, letterSpacing: 'var(--tracking-wide)', color: isActive ? 'var(--clr-cream)' : 'var(--clr-red-80)' }}>{String(i + 1).padStart(2, '0')}</span>
                  {/* Room name */}
                  <span style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--clr-cream)' }}>{label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Private booking CTA */}
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
          style={{
            marginTop: 'clamp(48px, 7vw, 72px)',
            padding: 'clamp(24px, 3.5vw, 40px) clamp(24px, 4vw, 52px)',
            background: 'var(--clr-red)',
            border: 'none',
            borderLeft: '8px solid var(--clr-cream)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '24px', flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: '46ch' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', fontWeight: 800, letterSpacing: 'var(--tracking-ultra)', color: 'var(--clr-cream)', margin: '0 0 10px' }}>PRIVATE EVENTS</p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(22px, 2.8vw, 34px)', letterSpacing: '-0.02em', color: 'var(--clr-void)', margin: 0, lineHeight: 1.1 }}>THE TIGER&apos;S DEN IS YOURS.</p>
            <p lang="ja" style={{ fontFamily: 'var(--font-jp)', fontSize: '20px', color: 'var(--clr-void)', margin: '6px 0 0', opacity: 0.65, fontWeight: 700 }}>おいトラ</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(13px, 1.1vw, 15px)', letterSpacing: '0.02em', lineHeight: 1.7, color: 'rgba(18,13,20,0.78)', margin: '14px 0 0' }}>
              Fully private bookings, curated menus and bespoke audio. Birthdays, team dinners, brand &amp; product launches, intimate celebrations.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                ['CAPACITY', 'Up to 18 seated · 25 standing'],
                ['EVENT TYPES', 'Birthdays · team dinners · launches'],
                ['BOOKING', 'Book 2+ weeks ahead for weekends'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 800, letterSpacing: '0.24em', color: 'var(--clr-ink-55)', minWidth: '92px' }}>{k}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', fontWeight: 600, letterSpacing: '0.01em', color: 'var(--clr-void)' }}>{v}</span>
                </div>
              ))}
            </div>
            <a
              href="mailto:hello@heytiger.ae?subject=Tiger%27s%20Den%20%E2%80%94%20%5BDate%5D%20enquiry"
              aria-label="Claim the Tiger's Den for a private event"
              style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--clr-cream)', background: 'var(--clr-void)', border: 'none', padding: '14px 32px', borderRadius: 0, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', minHeight: '52px', whiteSpace: 'nowrap', transition: 'background var(--dur-fast) var(--ease-standard)', textTransform: 'uppercase' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--border-structural)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--clr-void)'; }}
            >BOOK DEN</a>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) { .ht-space-title-row { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) { .ht-space-grid { grid-template-columns: 1fr !important; } .ht-photo-strip { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 480px) { .ht-photo-strip { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}
