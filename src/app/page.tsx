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
        <MenuGrid />
        <BookingBand id="booking-band-1" jp="予約" headline="READY TO ORDER?" onReserve={openReserve} microcopy="Reserve for tonight — the kitchen's waiting." />
        <SpaceSection   reduceMotion={reduceMotion} />
        <BookingBand id="booking-band-2" jp="お席へ" headline="FOUND YOUR ROOM?" onReserve={openReserve} sticker="/sticker4.png" stickerWhite microcopy="Reserve your room. We hold it for you." />

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
        background: 'var(--clr-void)',
        borderTop: '1px solid var(--border-structural)',
        borderBottom: '1px solid var(--border-structural)',
        padding: 'clamp(28px, 4vw, 48px) var(--space-section-x)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(20px, 3vw, 44px)',
        flexWrap: 'wrap',
        textAlign: 'center',
      }}
    >
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
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span lang="ja" style={{ fontFamily: 'var(--font-jp)', fontSize: 'clamp(20px, 2.4vw, 30px)', fontWeight: 700, color: 'var(--clr-red)' }}>{jp}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(22px, 3vw, 38px)', letterSpacing: 'var(--tracking-tight)', color: 'var(--clr-cream)', lineHeight: 1 }}>{headline}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onReserve}
          style={{
            background: 'var(--clr-red)', color: 'var(--clr-void)', border: 0, borderRadius: 0,
            padding: '15px 34px', minHeight: '44px', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', fontWeight: 900,
            letterSpacing: '0.32em', textTransform: 'uppercase', transition: 'background var(--dur-fast) var(--ease-standard)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--clr-red-dim)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--clr-red)'; }}
        >
          BOOK TABLE
        </button>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', letterSpacing: '0.04em', color: 'rgba(245,239,224,0.4)' }}>
          {microcopy ?? 'Dinner, drinks & brunch reservations.'}
        </span>
      </div>
    </section>
  );
}
