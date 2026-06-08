// ARCHIVED — possibly used on secondary pages.
// Confirm usage before restoring. Do not import from active components.
// Archived: 2026-05-31
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingCTA({ onReserve }: { onReserve: () => void }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const heroH = document.getElementById('hero')?.offsetHeight ?? window.innerHeight;
      setVisible(window.scrollY > heroH * 0.8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const show = visible && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          style={{
            position: 'fixed',
            bottom: 'clamp(20px, 3vw, 32px)',
            right: 'clamp(20px, 3vw, 32px)',
            zIndex: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {/* Dismiss button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDismissed(true)}
            aria-label="Dismiss reservation prompt"
            style={{
              background: 'rgba(20,20,20,0.82)',
              border: '1px solid rgba(237,231,201,0.14)',
              color: 'rgba(237,231,201,0.4)',
              width: '32px', height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >×</motion.button>

          {/* Main CTA */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onReserve}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.3em',
              color: '#141414',
              background: '#C54834',
              border: 'none',
              padding: '15px 28px',
              borderRadius: '40px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '10px',
              boxShadow: '0 8px 32px rgba(197,72,52,0.45), 0 2px 8px rgba(0,0,0,0.28)',
              minHeight: '48px',
              whiteSpace: 'nowrap',
            }}
          >
            {/* Pulsing dot */}
            <span style={{ position: 'relative', width: '8px', height: '8px', flexShrink: 0 }}>
              <span style={{
                position: 'absolute', inset: 0,
                background: '#141414',
                borderRadius: '50%',
                animation: 'ht-dot-pulse 1.8s ease-in-out infinite',
              }} />
              <span style={{
                position: 'absolute', inset: 0,
                background: '#141414',
                borderRadius: '50%',
                opacity: 0.4,
                animation: 'ht-dot-ring 1.8s ease-in-out infinite',
              }} />
            </span>
            BOOK A TABLE
          </motion.button>

          <style>{`
            @keyframes ht-dot-pulse {
              0%, 100% { transform: scale(1); }
              50%       { transform: scale(0.8); }
            }
            @keyframes ht-dot-ring {
              0%   { transform: scale(1);   opacity: 0.4; }
              70%  { transform: scale(2.4); opacity: 0;   }
              100% { transform: scale(2.4); opacity: 0;   }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
