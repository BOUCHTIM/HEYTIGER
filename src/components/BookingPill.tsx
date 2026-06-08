'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function BookingPill({ onOpen, modalOpen }: { onOpen: () => void; modalOpen: boolean }) {
  const [visible, setVisible] = useState(true);

  // O5: re-show after modal closes (600ms delay covers close animation)
  useEffect(() => {
    if (!modalOpen) {
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, [modalOpen]);

  const handleOpen = () => { setVisible(false); onOpen(); };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleOpen}
          onKeyDown={e => { if (e.key === 'Escape') setVisible(false); }}
          className="mobile-booking-pill"
          aria-label="Book a table"
          style={{
            position:     'fixed',
            bottom:       '24px',
            left:         '50%',
            transform:    'translateX(-50%)',
            zIndex:       100,
            background:   'var(--clr-red)',
            color:        'var(--clr-cream)',
            fontFamily:   'var(--font-bebas)',
            fontSize:     '16px',
            letterSpacing: 'var(--tracking-wide)',
            padding:      '14px 32px',
            borderRadius: 0,
            border:       'none',
            cursor:       'pointer',
            whiteSpace:   'nowrap',
            minWidth:     '44px',
            minHeight:    '44px',
          }}
        >
          BOOK TABLE
        </motion.button>
      )}
    </AnimatePresence>
  );
}
