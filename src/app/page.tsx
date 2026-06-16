/**
 * HEY TIGER — NUMEROLOGY REFACTOR
 *
 * Navigation:       6 → 7  (added THE PASS; restructured order)
 * MenuGrid chapters: 6 → 7  (added BRUNCH)
 * KanbanMenu signs:  6 → 7  (added RAMEN 麺)
 * Cinematic shots:   4 → 5  (added AFTER HOURS 宴 — critical: 4/shi avoided)
 * Menu categories:   6 → 7  (brunch category + 8 items in data/menu.ts)
 *
 * Unchanged (already auspicious):
 *   HorizontalScroll panels: 5
 *   SpaceSection rooms: 5
 *   StorySection beats: 3
 *   AboutOfferings pillars: 3 + 3
 *   Menu items per category: 8
 *
 * Motion tokens: src/lib/motion.ts
 *   Durations: 0.3 · 0.5 · 0.7 · 1.3 · 1.5 · 1.7
 *   Stagger:   0.07 · 0.08 · 0.13 · 0.17
 *   Loops:     7.8 · 8.0 · 8.8
 *
 * Animation hooks: src/hooks/
 *   useGalleryAnimations — pinned cross-dissolve gallery (CinematicCamera)
 *   useSectionReveal     — scroll-triggered [data-reveal] elements
 *   useHeroAnimations    — Framer Motion helpers with token timing
 *
 * TODO: Replace CinematicCamera shot 5 image with dedicated after-hours photo
 * TODO: Confirm BRUNCH chapter live menu items with kitchen team before launch
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import Image from 'next/image';

import ReservationModal from '@/components/ReservationModal';
import Footer           from '@/components/Footer';
import StorySection           from '@/components/StorySection';
import MenuGrid               from '@/components/MenuGrid';
import SpaceSection           from '@/components/SpaceSection';
import HeroPoster             from '@/components/HeroPoster';
import AboutOfferingsRedesign from '@/components/AboutOfferingsRedesign';
import HorizontalScroll        from '@/components/HorizontalScroll';
import CinematicCamera         from '@/components/CinematicCamera';



/* ─── Page ────────────────────────────────────────────────────────── */
export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const reduceMotion = !!useReducedMotion();

  // Scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, []);

  const openReserve = useCallback(() => setModalOpen(true), []);

  return (
    <>
      <a href="#hero" className="sr-only-focusable">SKIP TO MAIN CONTENT</a>

      <main style={{ background: 'var(--clr-void)', display: 'flex', flexDirection: 'column' }}>
        <HeroPoster onReserve={openReserve} />

        {/* Scroll target for the hero's "EXPLORE" link */}
        <div id="explore" aria-hidden="true" />
        <AboutOfferingsRedesign reduceMotion={reduceMotion} onReserve={openReserve} />

        <StorySection   reduceMotion={reduceMotion} />
        <CinematicCamera />
        <MenuGrid />
        <HorizontalScroll />
        <SpaceSection   reduceMotion={reduceMotion} />
        <BookingBand id="booking-band" jp="予約" headline="READY FOR THE NIGHT?" onReserve={openReserve} sticker="/sticker4.png" stickerWhite microcopy="Table, room, the whole night — reserved in one." />

      </main>

      <Footer onReserve={openReserve} />


      {modalOpen && <ReservationModal onClose={() => setModalOpen(false)} />}
    </>
  );
}

/* ─── Booking band — primary CTA anchor (after menu, after spaces) ──── */
function BookingBand({ id, jp, headline, onReserve, sticker, stickerWhite, microcopy }: { id?: string; jp: string; headline: string; onReserve: () => void; sticker?: string; stickerWhite?: boolean; microcopy?: string }) {
  return (
    <section
      id={id}
      aria-label="Book a table"
      style={{
        background: 'var(--clr-red)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: 'clamp(40px, 6vw, 64px) var(--space-section-x)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'clamp(24px, 4vw, 48px)',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        {sticker && (
          <Image
            src={sticker}
            alt=""
            width={120}
            height={100}
            unoptimized
            style={{ width: 'clamp(72px, 7vw, 120px)', height: 'auto', flexShrink: 0, filter: stickerWhite ? 'brightness(0) invert(1)' : undefined }}
          />
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span lang="ja" style={{ fontFamily: 'var(--font-jp)', fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 700, color: 'rgba(10,8,8,0.7)' }}>{jp}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 52px)', letterSpacing: '-0.02em', color: 'var(--clr-void)', lineHeight: 1 }}>{headline}</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
        <button
          onClick={onReserve}
          style={{
            background: 'var(--clr-void)', color: 'var(--clr-red)', border: '2px solid var(--clr-void)', borderRadius: 0,
            padding: '16px 40px', minHeight: '56px', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', fontWeight: 900,
            letterSpacing: '0.4em', textTransform: 'uppercase', transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,8,8,0.85)'; e.currentTarget.style.borderColor = 'var(--clr-void)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--clr-void)'; e.currentTarget.style.borderColor = 'var(--clr-void)'; }}
        >
          RESERVE NOW
        </button>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', letterSpacing: '0.12em', color: 'rgba(10,8,8,0.6)', fontWeight: 700 }}>
          {microcopy ?? 'Dinner, drinks & brunch reservations.'}
        </span>
      </div>
    </section>
  );
}
