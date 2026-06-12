'use client';

/**
 * ChopstickScroll — "The Grab"
 * ────────────────────────────────────────────────────────────────────────────
 * Two chopsticks fixed to the right of the viewport. As you scroll the whole
 * page, they close; at full depth they pinch shut with a particle burst, then
 * open again on scroll-up. Every value is a Framer Motion motion value driven
 * off a SPRING-smoothed scroll progress, so nothing re-renders on scroll — the
 * sticks are animated on the compositor, not by React.
 *
 * Orientation note: the brief's SVG was internally inconsistent (path put the
 * wide grip at the top, gradient labelled the tip at the top) and a
 * `bottom center` origin would make the tips *diverge* when "closing". To make
 * the pinch physically correct AND match the concept (tips reaching DOWN to
 * grab the content), we pivot from the TOP grip (`transformOrigin: top center`)
 * with the tips at the bottom, and reverse the gradient so the tips are the
 * light, glowing end. The provided path is kept verbatim.
 */

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  type MotionStyle,
} from 'framer-motion';

/* ── Tunables ─────────────────────────────────────────────────────────────── */
const PARTICLE_COUNT = 8;                                  // radial burst size
const BURST_COLORS = ['#c8a96e', '#e8521a', '#ffffff'];    // sake gold / orange / white
const PINCH_ON = 0.92;                                     // fire burst above this
const PINCH_OFF = 0.87;                                    // re-arm below this (hysteresis)

/* SSR-safe matchMedia hook — desktop ≥ 768px only. Server + first client paint
   both return false, so the component renders nothing until mounted (no
   hydration mismatch, zero work on mobile). */
function useIsDesktop(query = '(min-width: 768px)'): boolean {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const sync = () => setIsDesktop(mql.matches);
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, [query]);
  return isDesktop;
}

export default function ChopstickScroll() {
  const isDesktop = useIsDesktop();

  /* Raw progress across the WHOLE document (no target ref = full page scroll). */
  const { scrollYProgress } = useScroll();

  /* Spring-smoothed scroll — organic, alive, never robotic. Every transform
     below reads from this, so the motion always settles with real physics. */
  const p = useSpring(scrollYProgress, { stiffness: 55, damping: 18, restDelta: 0.001 });

  /* ── Derived motion values (no manual math, no re-renders) ───────────────── */
  // Sticks fan from a 30° spread (open) to a near-vertical 1° (pinched).
  const leftAngle = useTransform(p, [0, 1], [-30, -1]);
  const rightAngle = useTransform(p, [0, 1], [30, 1]);
  // Whole rig sinks 45px as it "bites" down into the content.
  const yDrift = useTransform(p, [0, 1], [0, 45]);
  // A last-stretch inward nudge so the tips actually kiss at the pinch (the
  // rotation alone leaves a small gap with non-overlapping pivots).
  const leftConverge = useTransform(p, [0.78, 1], [0, 6]);
  const rightConverge = useTransform(p, [0.78, 1], [0, -6]);
  // Tip glow: invisible → faint → hot. Blur widens as it intensifies.
  const glowOpacity = useTransform(p, [0, 0.6, 1], [0, 0.2, 0.85]);
  const glowBlur = useTransform(p, [0, 1], ['blur(8px)', 'blur(20px)']);
  const glowScale = useTransform(p, [0, 1], [0.5, 1.2]);
  // Sticks brighten from shadowed to fully lit as they close.
  const stickFilter = useTransform(p, [0, 1], ['brightness(0.65)', 'brightness(1)']);
  // Vertical 箸 label: fades in by 0.1, holds at 0.4, gone by 0.9.
  const labelOpacity = useTransform(p, [0, 0.1, 0.9, 1], [0, 0.4, 0.4, 0]);

  /* ── Pinch threshold → burst ─────────────────────────────────────────────
     The ONLY React state in the component. useMotionValueEvent fires on the
     motion-value stream (compositor), and the hysteresis ref guarantees one
     state change per crossing — never per scroll frame. Bumping burstId remounts
     the burst group (via key) so it re-fires each time you re-enter the pinch. */
  const armed = useRef(false);
  const [burstId, setBurstId] = useState(0);
  useMotionValueEvent(p, 'change', (v) => {
    if (v > PINCH_ON && !armed.current) {
      armed.current = true;
      setBurstId((n) => n + 1);
    } else if (v < PINCH_OFF && armed.current) {
      armed.current = false;
    }
  });

  if (!isDesktop) return null; // hard stop on mobile — nothing mounts, zero cost

  const STICK_H = 'clamp(160px, 19vw, 260px)';

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        right: 'clamp(1.5rem, 3vw, 3rem)',
        width: 60,
        height: '100vh',
        zIndex: 900,            // above content, below loader/cursor/grain overlays
        pointerEvents: 'none',  // purely decorative — never intercepts input
        display: 'flex',
        alignItems: 'center',   // centre the rig in the viewport
        justifyContent: 'center',
      }}
    >
      {/* Rig — the whole assembly drifts down together as the sticks close. */}
      <motion.div style={{ position: 'relative', width: 60, height: STICK_H, y: yDrift }}>
        {/* ── 0.00 → 1.00 : LEFT stick. Pivots at the top grip; tip swings at
            the bottom. brightness lifts as it closes. ── */}
        <ChopStick
          side="left"
          height={STICK_H}
          style={{
            left: 22,
            rotate: leftAngle,
            x: leftConverge,
            filter: stickFilter,
          }}
        />
        {/* ── RIGHT stick — mirror of the left. ── */}
        <ChopStick
          side="right"
          height={STICK_H}
          style={{
            left: 30,
            rotate: rightAngle,
            x: rightConverge,
            filter: stickFilter,
          }}
        />

        {/* ── 0.25 → 1.00 : ORANGE GLOW at the tip convergence (bottom). Scales,
            brightens and blurs as the tips meet; subtle pulse at full depth. ── */}
        <motion.div
          style={{
            position: 'absolute',
            top: '100%',
            left: 30,            // mid-point between the two stick pivots
            width: 40,
            height: 40,
            marginLeft: -20,
            marginTop: -24,      // lift the orb up onto the tips
            borderRadius: '50%',
            opacity: glowOpacity,
            scale: glowScale,
            filter: glowBlur,
            willChange: 'transform, opacity, filter',
          }}
        >
          <motion.div
            // gentle heartbeat — keeps the pinched glow feeling alive (1.00)
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(232,82,26,0.95) 0%, rgba(232,82,26,0.35) 38%, transparent 70%)',
            }}
          />
        </motion.div>

        {/* ── 0.10 → 0.90 : vertical 箸 label, centred between the sticks. ── */}
        <motion.span
          lang="ja"
          style={{
            position: 'absolute',
            top: '50%',
            left: 30,
            transform: 'translate(-50%, -50%)',
            writingMode: 'vertical-rl',
            fontFamily: "var(--font-japanese-serif, 'Noto Serif JP', serif)",
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            color: 'rgba(200, 169, 110, 0.6)',
            opacity: labelOpacity,
            userSelect: 'none',
          }}
        >
          箸
        </motion.span>

        {/* ── 0.92 : PINCH BURST + 箸 flash at the tip convergence. ── */}
        <div style={{ position: 'absolute', top: '100%', left: 30, marginTop: -22 }}>
          <AnimatePresence>
            {burstId > 0 && <PinchBurst key={burstId} />}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

/* ── A single tapered chopstick, rendered as an SVG path (not a div). ──────────
   transformOrigin top center = pivot at the grip. Provided path kept verbatim;
   gradient reversed so the TIP (bottom) is the light, glowing end. */
function ChopStick({
  side,
  height,
  style,
}: {
  side: 'left' | 'right';
  height: string;
  style: MotionStyle;
}) {
  const gradId = `stickGrad-${side}`;
  const shadowId = `stickShadow-${side}`;
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        width: 8,
        height,
        transformOrigin: 'top center', // pivot at the anchored grip
        willChange: 'transform, filter',
        transform: 'translateZ(0)',    // force a dedicated GPU layer
        ...style,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 8 260"
        preserveAspectRatio="none"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            {/* top = grip (anchored, shadowed) → bottom = tip (light, glowing) */}
            <stop offset="0%" stopColor="#5c3a0f" stopOpacity="0.5" />
            <stop offset="35%" stopColor="#8b5e2a" stopOpacity="0.82" />
            <stop offset="72%" stopColor="#c8a96e" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#f5e6c8" stopOpacity="0.98" />
          </linearGradient>
          <filter id={shadowId} x="-60%" y="-10%" width="220%" height="120%">
            <feDropShadow dx="1" dy="0" stdDeviation="2" floodColor="#c8a96e" floodOpacity="0.3" />
          </filter>
        </defs>
        {/* slight taper: ~4px grip → ~1.5px tip */}
        <path
          d="M4,2 C4.5,2 6,3 6,8 L5,260 L3,260 L2,8 C2,3 3.5,2 4,2 Z"
          fill={`url(#${gradId})`}
          filter={`url(#${shadowId})`}
        />
      </svg>
    </motion.div>
  );
}

/* ── Radial particle burst + a bright 箸 flash. Mounted fresh on each pinch
   (keyed by burstId) so the entrance animation always replays. ──────────────── */
function PinchBurst() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'absolute', left: 0, top: 0 }}
    >
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        // even radial spread; each particle a 2–3px dot in a brand colour
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
        const distance = 28;
        const size = 2 + Math.random();
        const color = BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)];
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, scale: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: -size / 2,
              top: -size / 2,
              width: size,
              height: size,
              borderRadius: '50%',
              background: color,
            }}
          />
        );
      })}

      {/* the "箸" flash — fades in bright, then settles out */}
      <motion.span
        lang="ja"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 1, 0], scale: [0.6, 1.25, 1] }}
        transition={{ duration: 0.85, ease: 'easeOut', times: [0, 0.32, 1] }}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-japanese-serif)',
          fontSize: '1.1rem',
          lineHeight: 1,
          color: '#f5e6c8',
          textShadow: '0 0 12px rgba(232, 82, 26, 0.85)',
          userSelect: 'none',
        }}
      >
        箸
      </motion.span>
    </motion.div>
  );
}
