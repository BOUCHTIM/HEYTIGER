'use client';

import { motion } from 'framer-motion';

/**
 * LetterboxBars — the two black cinema bars that slide in to frame the hero as a
 * widescreen title card. z-index 10 keeps them above the grain + background.
 */
export default function LetterboxBars() {
  const transition = { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 };

  return (
    <>
      <motion.div
        aria-hidden="true"
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        transition={transition}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '44px', background: '#000', zIndex: 10 }}
      />
      <motion.div
        aria-hidden="true"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={transition}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '44px', background: '#000', zIndex: 10 }}
      />
    </>
  );
}
