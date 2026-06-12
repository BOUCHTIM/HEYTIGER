'use client';

import { motion } from 'framer-motion';

/**
 * RopeString — a thin festival string strung between the nails of the top three
 * boards (食 · 酒 · 夜), sagging naturally between each.
 *
 * Nail anchors are approximate: each board's left is a % but its width is px, so
 * the nail centre (left% + width/2) is estimated against a ~1400px canvas and
 * expressed in a 0–100 viewBox (preserveAspectRatio="none" stretches it to fit).
 * Two quadratic curves with control points ~3 units below the chord give the sag.
 */

// nail ≈ (left% + halfWidthAs%, top% − a touch for the 16px nail rise)
const IZAKAYA = { x: 11.6, y: 16 }; // top 18% / left 3% / w240
const SAKE = { x: 37.5, y: 4.5 }; //  top 6%  / left 30% / w210
const LATE = { x: 62, y: 2.5 }; //   top 4%  / left 55% / w195

const PATH = `M${IZAKAYA.x} ${IZAKAYA.y} Q24.5 13.3 ${SAKE.x} ${SAKE.y} Q49.8 6.5 ${LATE.x} ${LATE.y}`;

export default function RopeString() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 }}
    >
      <motion.path
        d={PATH}
        fill="none"
        stroke="rgba(200,169,110,0.25)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 2, ease: 'easeInOut' }}
      />
    </svg>
  );
}
