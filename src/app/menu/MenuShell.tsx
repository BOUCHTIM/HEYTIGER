'use client';

import { useState, useCallback } from 'react';
import ReservationModal from '@/components/ReservationModal';
import TopNav from '@/components/redesign/TopNav';
import MenuRedesign from '@/components/redesign/MenuRedesign';
import SiteFooter from '@/components/redesign/SiteFooter';
import Motion from '@/components/redesign/Motion';

export default function MenuShell() {
  const [modalOpen, setModalOpen] = useState(false);
  const openReserve = useCallback(() => setModalOpen(true), []);
  return (
    <div className="rd-page">
      <Motion />
      <TopNav onReserve={openReserve} />
      <MenuRedesign />
      <SiteFooter />
      {modalOpen && <ReservationModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
