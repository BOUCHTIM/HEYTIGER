/**
 * HEY TIGER — homepage (Sep 2026 redesign, Figma HT_HOMEPAGE_DESKTOP)
 *
 * Section order mirrors the frame: nav → hero → pillar strip → about →
 * menu teaser → poster band → what's on → location → shop → save a seat → footer.
 * Copy lives in src/data/site.ts; styles in src/app/redesign.css.
 */
'use client';

import { useState, useCallback, useEffect } from 'react';

import ReservationModal from '@/components/ReservationModal';
import TopNav from '@/components/redesign/TopNav';
import Hero from '@/components/redesign/Hero';
import PillarStrip from '@/components/redesign/PillarStrip';
import AboutSection from '@/components/redesign/AboutSection';
import MenuTeaser from '@/components/redesign/MenuTeaser';
import PosterBand from '@/components/redesign/PosterBand';
import WhatsOn from '@/components/redesign/WhatsOn';
import LocationSection from '@/components/redesign/LocationSection';
import ShopSection from '@/components/redesign/ShopSection';
import SaveASeat from '@/components/redesign/SaveASeat';
import SiteFooter from '@/components/redesign/SiteFooter';
import Motion from '@/components/redesign/Motion';

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);

  // Start at the top on a fresh load — unless we arrived via a section link
  // (e.g. /#about from the menu page), in which case let the hash win.
  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo(0, 0);
    const lenis = (window as unknown as { lenis?: { scrollTo: (n: number, o?: object) => void } }).lenis;
    lenis?.scrollTo(0, { immediate: true });
  }, []);

  const openReserve = useCallback(() => setModalOpen(true), []);

  return (
    <div className="rd-page">
      <Motion />
      <a href="#hero" className="sr-only-focusable">SKIP TO MAIN CONTENT</a>
      <TopNav onReserve={openReserve} />
      <main>
        <Hero onReserve={openReserve} />
        <PillarStrip />
        <AboutSection />
        <MenuTeaser />
        <PosterBand />
        <WhatsOn />
        <LocationSection onReserve={openReserve} />
        <ShopSection />
        <SaveASeat onReserve={openReserve} />
      </main>
      <SiteFooter />
      {modalOpen && <ReservationModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
