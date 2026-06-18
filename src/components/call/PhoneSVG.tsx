'use client';

import { motion, useReducedMotion } from 'framer-motion';

/* Shōwa-era 赤電話 (aka-denwa) — the red Japanese public phone, stylised to the
   Hey Tiger palette. Two animated states:
     ringing → body shakes, glow halo pulses, handset jitters
     lifted  → handset rises off the cradle, cord stretches
   Pure SVG so it stays crisp and animatable at any size. */

const RED = '#C0271A';
const RED_DK = '#7E160E';
const CREAM = '#F2E4CC';
const GOLD = '#C8A96E';
const INK = '#1A0B08';

export default function PhoneSVG({
  ringing = false,
  lifted = false,
  size = 240,
}: {
  ringing?: boolean;
  lifted?: boolean;
  size?: number;
}) {
  const reduce = useReducedMotion();
  const shake = ringing && !reduce && !lifted;

  return (
    <motion.svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 240 300"
      role="img"
      aria-label={ringing ? 'Phone ringing' : 'Red telephone'}
      animate={shake ? { rotate: [0, -2.2, 2.2, -1.6, 1.6, 0], x: [0, -1.5, 1.5, -1, 1, 0] } : { rotate: 0, x: 0 }}
      transition={shake ? { duration: 0.55, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
      style={{ overflow: 'visible', display: 'block' }}
    >
      <defs>
        <linearGradient id="ht-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D8331F" />
          <stop offset="0.55" stopColor={RED} />
          <stop offset="1" stopColor={RED_DK} />
        </linearGradient>
        <radialGradient id="ht-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={GOLD} stopOpacity="0.55" />
          <stop offset="1" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ring halo — expanding gold rings while ringing */}
      {ringing && !reduce && (
        <g aria-hidden="true">
          {[0, 0.5].map((delay) => (
            <motion.circle
              key={delay}
              cx="120"
              cy="170"
              r="90"
              fill="none"
              stroke={GOLD}
              strokeWidth="2"
              initial={{ scale: 0.7, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay }}
              style={{ transformOrigin: '120px 170px' }}
            />
          ))}
          <motion.ellipse
            cx="120" cy="175" rx="115" ry="120"
            fill="url(#ht-glow)"
            animate={{ opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>
      )}

      {/* ── Body ── */}
      <g>
        {/* base / foot */}
        <rect x="46" y="246" width="148" height="30" rx="8" fill={RED_DK} />
        <rect x="40" y="262" width="160" height="20" rx="9" fill={INK} opacity="0.55" />
        {/* main shell */}
        <rect x="40" y="92" width="160" height="170" rx="30" fill="url(#ht-body)" stroke={RED_DK} strokeWidth="2" />
        {/* top cradle bed */}
        <rect x="52" y="104" width="136" height="40" rx="18" fill={RED_DK} opacity="0.45" />
        {/* highlight sheen */}
        <rect x="56" y="150" width="40" height="96" rx="18" fill="#fff" opacity="0.06" />

        {/* Rotary dial */}
        <circle cx="120" cy="196" r="50" fill={CREAM} stroke={GOLD} strokeWidth="3" />
        <circle cx="120" cy="196" r="20" fill={RED} stroke={RED_DK} strokeWidth="2" />
        {/* finger holes */}
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (-120 + i * 24) * (Math.PI / 180);
          const cx = 120 + Math.cos(a) * 35;
          const cy = 196 + Math.sin(a) * 35;
          return <circle key={i} cx={cx} cy={cy} r="5.4" fill={INK} opacity="0.78" />;
        })}
        {/* finger stop */}
        <rect x="158" y="188" width="14" height="9" rx="3" fill={GOLD} transform="rotate(28 165 192)" />
        {/* tiger-stripe nod under the dial */}
        <g opacity="0.5">
          <rect x="92" y="252" width="6" height="0" fill={CREAM} />
        </g>
      </g>

      {/* ── Cord (coiled) ── */}
      <motion.path
        d={lifted
          ? 'M70 92 C 50 130, 60 150, 80 150'
          : 'M70 92 C 58 110, 66 120, 76 120'}
        fill="none"
        stroke={INK}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.6"
        animate={{ opacity: 0.6 }}
      />

      {/* ── Handset ── lifts up & tilts when picked up */}
      <motion.g
        animate={
          lifted
            ? { y: -52, rotate: -10 }
            : shake
            ? { y: [0, -2, 0], rotate: [0, -1.5, 1.5, 0] }
            : { y: 0, rotate: 0 }
        }
        transition={
          lifted
            ? { type: 'spring', stiffness: 180, damping: 16 }
            : shake
            ? { duration: 0.28, repeat: Infinity }
            : { duration: 0.3 }
        }
        style={{ transformOrigin: '120px 92px' }}
      >
        {/* bar */}
        <rect x="58" y="74" width="124" height="22" rx="11" fill={INK} />
        <rect x="58" y="74" width="124" height="10" rx="5" fill="#33201b" />
        {/* earpiece / mouthpiece cups */}
        <ellipse cx="62" cy="86" rx="20" ry="17" fill={INK} />
        <ellipse cx="178" cy="86" rx="20" ry="17" fill={INK} />
        <circle cx="62" cy="86" r="9" fill="#2a1712" />
        <circle cx="178" cy="86" r="9" fill="#2a1712" />
        <circle cx="62" cy="86" r="4" fill={GOLD} opacity="0.5" />
        <circle cx="178" cy="86" r="4" fill={GOLD} opacity="0.5" />
      </motion.g>
    </motion.svg>
  );
}
