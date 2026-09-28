'use client';

import { useState, useCallback } from 'react';
import ReservationModal from '@/components/ReservationModal';
import TopNav from '@/components/redesign/TopNav';
import MenuRedesign from '@/components/redesign/MenuRedesign';
import SiteFooter from '@/components/redesign/SiteFooter';

export default function MenuShell() {
  const [modalOpen, setModalOpen] = useState(false);
  const openReserve = useCallback(() => setModalOpen(true), []);
  return (
    <div className="rd-page">
      <TopNav onReserve={openReserve} />
      <MenuRedesign />
      <SiteFooter />
      {modalOpen && <ReservationModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
