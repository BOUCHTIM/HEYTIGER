// ARCHIVED — possibly used on secondary pages.
// Confirm usage before restoring. Do not import from active components.
// Archived: 2026-05-31
'use client';

import { Fragment, startTransition, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useInView, AnimatePresence, useReducedMotion, useTransform } from 'framer-motion';
import { StaggeredText, MagneticButton, FloatingKanji, HeroIllustration } from './HeroMotion';

// Brand-anchored narrative — "crossing the threshold into Hey Tiger".
// Maps to the actual brand pillars: dusk → lanterns → step in → greeting.
// Works with the actual restaurant footage. Lands the reveal as a welcome,
// not a noir mystery.
const STORY_LINES = [
  { id: 0, text: 'THE STREET QUIETS.\nDAY SLIPS INTO DUSK.', scrimColor: 'rgba(232,52,26,0.12)', accentColor: 'rgba(201,162,39,0.65)' },
  { id: 1, text: 'LANTERNS LIGHT.\nSTEAM RISES OFF THE BAR.', scrimColor: 'rgba(250,175,63,0.10)', accentColor: 'rgba(250,175,63,0.72)' },
  { id: 2, text: 'YOU FOLLOW THE GLOW.\nA DOOR, A NOD, A WELCOME.', scrimColor: 'rgba(232,52,26,0.14)', accentColor: 'rgba(232,52,26,0.72)' },
  { id: 3, text: 'AND ACROSS THE ROOM,\nA VOICE FINDS YOU —', scrimColor: 'rgba(232,52,26,0.22)', accentColor: 'rgba(232,52,26,0.9)' },
];

export default function Hero({ scrollContainerRef }: { scrollContainerRef?: React.RefObject<HTMLElement | null> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [ringing, setRinging] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  // Track last phase to avoid unnecessary re-renders on every scroll tick
  const phaseRef = useRef(0);

  const { scrollYProgress } = useScroll({ container: scrollContainerRef, target: containerRef });
  const leftSlopeX = useTransform(scrollYProgress, [0.58, 0.9], ['0%', '-118%']);
  const rightSlopeX = useTransform(scrollYProgress, [0.58, 0.9], ['0%', '118%']);
  const leftSlopeRotate = useTransform(scrollYProgress, [0.58, 0.9], [0, -5]);
  const rightSlopeRotate = useTransform(scrollYProgress, [0.58, 0.9], [0, 5]);
  const stackOpacity = useTransform(scrollYProgress, [0.02, 0.14, 0.68, 0.9], [0.12, 0.38, 0.34, 0]);
  const backLayerY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%']);
  const midLayerY = useTransform(scrollYProgress, [0, 1], ['0%', '-9%']);
  const frontLayerY = useTransform(scrollYProgress, [0, 1], ['0%', '-4%']);
  const frontLayerScale = useTransform(scrollYProgress, [0, 0.72, 1], [1, 1.05, 1.09]);
  const centerGlowScale = useTransform(scrollYProgress, [0, 0.9], [0.92, 1.28]);
  const centerGlowOpacity = useTransform(scrollYProgress, [0.12, 0.62, 0.9], [0.45, 0.7, 0]);

  // Decide whether to fetch the video at all (mobile data / reduced motion aware)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    type ConnectionLike = { saveData?: boolean; effectiveType?: string };
    const nav = navigator as Navigator & { connection?: ConnectionLike };
    const conn = nav.connection;
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compute = () => {
      const slow = conn?.saveData === true
        || conn?.effectiveType === 'slow-2g'
        || conn?.effectiveType === '2g'
        || conn?.effectiveType === '3g';
      return !motionMq.matches && !slow;
    };

    const t = window.setTimeout(() => setShouldLoadVideo(compute()), 0);
    const onMotionChange = () => setShouldLoadVideo((prev) => prev && !motionMq.matches);
    motionMq.addEventListener('change', onMotionChange);
    return () => {
      window.clearTimeout(t);
      motionMq.removeEventListener('change', onMotionChange);
    };
  }, []);

  // Respect prefers-reduced-motion at the video element level too
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      const v = videoRef.current;
      if (!v) return;
      if (mq.matches) { v.pause(); }
      else { v.play().catch(() => {}); }
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [shouldLoadVideo]);

  useEffect(() => {
    let rafId: number;
    const unsub = scrollYProgress.on('change', (v) => {
      // Compute next phase
      let next = 0;
      if (v < 0.25)       next = 0;
      else if (v < 0.5)   next = 1;
      else if (v < 0.7)   next = 2;
      else if (v < 0.85)  next = 3;
      else                next = 4;

      // Skip if phase hasn't changed — prevents re-renders on every scroll tick
      if (next === phaseRef.current) return;
      phaseRef.current = next;

      // Schedule via rAF so the update lands in the paint cycle, not mid-scroll
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // startTransition de-prioritises the update — browser can paint first
        startTransition(() => {
          setPhase(next);
          if (next === 3) setRinging(true);
          if (next === 4) { setRevealed(true); setRinging(false); }
        });
      });
    });
    return () => { unsub(); cancelAnimationFrame(rafId); };
  }, [scrollYProgress]);

  return (
    <section id="main" ref={containerRef} aria-label="Hero — The Phone Call Story" style={{ position: 'relative', height: '220vh' }}>
      {/* Keyboard-only skip link — visually hidden until focused */}
      <a href="#story" className="sr-only-focusable">
        SKIP INTRO ↓
      </a>
      <div
        style={{
          position: 'sticky',
          top: 0,
          // dvh = dynamic viewport height — accounts for mobile browser chrome
          height: '100dvh',
          minHeight: '100vh',  // fallback for browsers without dvh
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
          aria-hidden="true"
        >
          {/* Cinematic background — video on capable connections, still poster otherwise */}
          <video
            ref={videoRef}
            src={shouldLoadVideo ? '/hero-bg.mp4' : undefined}
            autoPlay={shouldLoadVideo}
            muted
            loop={shouldLoadVideo}
            playsInline
            preload={shouldLoadVideo ? 'auto' : 'none'}
            poster="/herophoto.png"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 30%',
              filter: 'contrast(1.1) saturate(1.18) brightness(0.92)',
              WebkitFilter: 'contrast(1.1) saturate(1.18) brightness(0.92)',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              opacity: shouldLoadVideo ? 1 : 0,
              transition: 'opacity 0.45s ease',
            }}
          />
          <img
            src="/herophoto.png"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 30%',
              filter: 'contrast(1.1) saturate(1.18) brightness(0.92)',
              opacity: shouldLoadVideo ? 0 : 1,
              transition: 'opacity 0.45s ease',
              animation: 'ht-hero-kenburns 20s ease-in-out infinite alternate',
            }}
          />
        </motion.div>

        {/* Cinematic scrim — deep vignette + bottom fog */}
        {phase < 4 && (
          <>
            {!prefersReducedMotion && (
              <motion.div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  opacity: stackOpacity,
                }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    width: 'clamp(300px, 46vw, 760px)',
                    height: 'clamp(340px, 56vh, 620px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(245,239,224,0.08)',
                    background: 'linear-gradient(180deg, rgba(245,239,224,0.03) 0%, rgba(245,239,224,0.01) 100%)',
                    boxShadow: '0 34px 90px rgba(0,0,0,0.22)',
                    y: backLayerY,
                  }}
                />
                <motion.div
                  style={{
                    position: 'absolute',
                    width: 'clamp(280px, 42vw, 700px)',
                    height: 'clamp(320px, 52vh, 560px)',
                    borderRadius: '22px',
                    border: '1px solid rgba(250,175,63,0.12)',
                    background: 'linear-gradient(180deg, rgba(250,175,63,0.04) 0%, rgba(232,52,26,0.02) 100%)',
                    boxShadow: '0 26px 72px rgba(0,0,0,0.28)',
                    y: midLayerY,
                  }}
                />
                <motion.div
                  style={{
                    position: 'absolute',
                    width: 'clamp(260px, 38vw, 640px)',
                    height: 'clamp(300px, 48vh, 500px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(232,52,26,0.16)',
                    background: 'linear-gradient(180deg, rgba(232,52,26,0.06) 0%, rgba(250,175,63,0.03) 100%)',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.34)',
                    y: frontLayerY,
                    scale: frontLayerScale,
                  }}
                />
                <motion.div
                  style={{
                    position: 'absolute',
                    width: 'clamp(240px, 32vw, 520px)',
                    height: 'clamp(240px, 34vh, 340px)',
                    borderRadius: '999px',
                    background: 'radial-gradient(circle, rgba(250,175,63,0.08) 0%, rgba(232,52,26,0.06) 42%, transparent 72%)',
                    filter: 'blur(26px)',
                    scale: centerGlowScale,
                    opacity: centerGlowOpacity,
                  }}
                />
              </motion.div>
            )}
            {/* Base dark vignette */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 3,
                background: 'linear-gradient(to top, rgba(6,4,6,0.96) 0%, rgba(6,4,6,0.72) 20%, rgba(6,4,6,0.24) 50%, rgba(6,4,6,0.55) 100%)',
                pointerEvents: 'none',
              }}
            />
            {!prefersReducedMotion && (
              <>
                <motion.div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '-8%',
                    width: '60%',
                    zIndex: 6,
                    pointerEvents: 'none',
                    x: leftSlopeX,
                    rotate: leftSlopeRotate,
                    transformOrigin: 'left center',
                    clipPath: 'polygon(0 0, 100% 0, 82% 100%, 0 100%)',
                    background: 'linear-gradient(180deg, rgba(6,4,6,0.94) 0%, rgba(12,8,10,0.92) 100%)',
                    borderRight: '1px solid rgba(250,175,63,0.14)',
                    boxShadow: '22px 0 60px rgba(0,0,0,0.34)',
                  }}
                />
                <motion.div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: '-8%',
                    width: '60%',
                    zIndex: 6,
                    pointerEvents: 'none',
                    x: rightSlopeX,
                    rotate: rightSlopeRotate,
                    transformOrigin: 'right center',
                    clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)',
                    background: 'linear-gradient(180deg, rgba(6,4,6,0.94) 0%, rgba(12,8,10,0.92) 100%)',
                    borderLeft: '1px solid rgba(232,52,26,0.16)',
                    boxShadow: '-22px 0 60px rgba(0,0,0,0.34)',
                  }}
                />
              </>
            )}
            {/* Ambient per-phase color tint — transitions with the story */}
            <motion.div
              aria-hidden="true"
              key={`scrim-${phase}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 4,
                background: `radial-gradient(ellipse at 50% 80%, ${STORY_LINES[phase]?.scrimColor ?? 'transparent'} 0%, transparent 65%)`,
                pointerEvents: 'none',
              }}
            />
            {/* Cinematic bars — top and bottom black letterbox */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 'clamp(56px, 7vh, 88px)',
                background: 'linear-gradient(to bottom, rgba(6,4,6,1) 0%, rgba(6,4,6,0.0) 100%)',
                zIndex: 5,
                pointerEvents: 'none',
              }}
            />
          </>
        )}

        {/* Story text — cinematic card with backdrop blur */}
        <AnimatePresence mode="sync">
          {phase < 4 && (
            <motion.div
              key={`story-${phase}`}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: 'absolute',
                bottom: 'clamp(80px, 13vh, 160px)',
                left: 0,
                right: 0,
                zIndex: 10,
                display: 'flex',
                justifyContent: 'center',
                padding: '0 clamp(24px, 6vw, 80px)',
                pointerEvents: 'none',
              }}
            >
              <div style={{
                display: 'inline-block',
                background: 'rgba(6,4,6,0.48)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${STORY_LINES[phase]?.accentColor ?? 'rgba(201,162,39,0.3)'}`,
                borderRadius: '4px',
                padding: 'clamp(22px, 3.5vw, 40px) clamp(28px, 5vw, 64px)',
                maxWidth: 'min(760px, 88vw)',
                textAlign: 'center',
                boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
              }}>
                {/* Chapter counter */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '18px',
                }}>
                  <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${STORY_LINES[phase]?.accentColor ?? 'rgba(201,162,39,0.5)'})` }} />
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '10px',
                    letterSpacing: '0.5em',
                    color: STORY_LINES[phase]?.accentColor ?? 'rgba(201,162,39,0.65)',
                    fontWeight: 700,
                  }}>
                    {String(phase + 1).padStart(2, '0')} / 04
                  </span>
                  <div style={{ flex: 1, height: '1px', background: `linear-gradient(to left, transparent, ${STORY_LINES[phase]?.accentColor ?? 'rgba(201,162,39,0.5)'})` }} />
                </div>
                {/* Story headline */}
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 4.4vw, 62px)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.06,
                  color: 'var(--clr-cream)',
                  whiteSpace: 'pre-line',
                  fontWeight: 900,
                  margin: 0,
                }}>
                  {STORY_LINES[phase]?.text}
                </p>
                {/* Progress dots */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '22px',
                }}>
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{
                      width: i === phase ? '24px' : '6px',
                      height: '4px',
                      borderRadius: '2px',
                      background: i === phase
                        ? (STORY_LINES[phase]?.accentColor ?? 'rgba(201,162,39,0.9)')
                        : 'rgba(245,239,224,0.22)',
                      transition: 'width 0.35s ease, background 0.35s ease',
                    }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient lantern pulse — replaces phone icon, pure atmosphere */}
        <AnimatePresence>
          {phase >= 1 && phase < 4 && (
            <motion.div
              key="lantern-pulse"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: 'spring', stiffness: 140, damping: 18 }}
              style={{ position: 'absolute', top: '15%', right: 'clamp(32px, 8vw, 120px)', zIndex: 10, pointerEvents: 'none' }}
            >
              <PhoneIcon ringing={ringing} />
              {ringing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ textAlign: 'center', marginTop: '10px', fontFamily: 'var(--font-jp)', fontSize: '13px', letterSpacing: '0.2em', color: 'var(--clr-red)' }}
                >
                  ● ● ●
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vertical Japanese text — right edge atmosphere */}
        {phase < 4 && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: 'clamp(14px, 2vw, 28px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 8,
              writingMode: 'vertical-rl',
              fontFamily: 'var(--font-jp)',
              fontSize: 'clamp(9px, 0.9vw, 12px)',
              letterSpacing: '0.4em',
              color: 'rgba(245,239,224,0.18)',
              fontWeight: 700,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            ヘイタイガー · MOTOR CITY · DUBAI
          </div>
        )}

        <AnimatePresence>
          {revealed && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 12,
                backgroundColor: '#060406',
                overflow: 'hidden',
              }}
            >
              {/* ── RIGHT PANEL: restaurant photo bleeds through ── */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: '58%',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/herophoto.png"
                  alt=""
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    filter: 'contrast(1.05) saturate(0.9) brightness(0.72)',
                    transform: 'scale(1.04)',
                  }}
                />
                {/* Gradient mask — fades into the left dark zone */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to right, #060406 0%, rgba(6,4,6,0.55) 30%, rgba(6,4,6,0.12) 65%, rgba(6,4,6,0.45) 100%)',
                  zIndex: 1,
                }} />
                {/* Bottom scrim on photo */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(6,4,6,0.85) 0%, transparent 45%)',
                  zIndex: 2,
                }} />
                {/* Warm amber tint overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse at 60% 35%, rgba(250,175,63,0.08) 0%, transparent 60%)',
                  zIndex: 3,
                }} />
              </div>

              {/* Giant 虎 — ghost watermark, right-anchored */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  right: '-6%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontFamily: 'var(--font-jp)',
                  fontWeight: 900,
                  fontSize: 'clamp(380px, 62vw, 900px)',
                  lineHeight: 1,
                  color: 'rgba(255,255,255,0.022)',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  letterSpacing: '-0.05em',
                  zIndex: 13,
                  mixBlendMode: 'screen',
                }}
              >
                虎
              </div>

              {/* Warm ambient glow — pools left-center behind headline */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '-8%',
                  top: '30%',
                  width: '70vw',
                  height: '70vh',
                  background: 'radial-gradient(ellipse at center, rgba(232,52,26,0.07) 0%, rgba(250,175,63,0.06) 35%, transparent 65%)',
                  filter: 'blur(60px)',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              />

              {/* Floating kanji — subtle texture */}
              <FloatingKanji />

              {/* Animated torii gate — now upper-right area */}
              <HeroIllustration delay={0.5} />

              {/* ── LEFT COLUMN: editorial content ── */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  paddingTop: 'env(safe-area-inset-top)',
                  paddingBottom: 'env(safe-area-inset-bottom)',
                  paddingLeft: 'clamp(40px, 7vw, 108px)',
                  paddingRight: '52%',
                  zIndex: 14,
                }}
              >
                {/* Location eyebrow with rule */}
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.10, duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'clamp(20px, 2.8vw, 36px)' }}
                >
                  <div style={{ width: '32px', height: '1px', backgroundColor: 'rgba(250,175,63,0.6)' }} />
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '10px',
                    letterSpacing: '0.52em',
                    color: 'rgba(250,175,63,0.72)',
                    fontWeight: 700,
                  }}>
                    MOTOR CITY · DUBAI
                  </span>
                </motion.div>

                {/* Japanese identity */}
                <motion.p
                  lang="ja"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 0.55, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.55 }}
                  style={{
                    fontFamily: 'var(--font-jp)',
                    fontSize: 'clamp(14px, 1.6vw, 20px)',
                    letterSpacing: '0.32em',
                    color: 'var(--clr-cream)',
                    marginBottom: 'clamp(8px, 1vw, 14px)',
                    fontWeight: 700,
                  }}
                >
                  ヘイ、タイガー
                </motion.p>

                {/* Main headline — BIG */}
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.22, duration: 0.5 }}
                  className="ht-title-shadow"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: 'clamp(56px, 10vw, 152px)',
                    lineHeight: 0.90,
                    color: 'var(--clr-cream)',
                    letterSpacing: '-0.035em',
                    fontStyle: 'normal',
                    whiteSpace: 'nowrap',
                    WebkitTextStroke: '1px rgba(13,13,13,0.18)',
                    textShadow: [
                      '0 2px 0 rgba(13,13,13,0.4)',
                      '0 6px 0 rgba(13,13,13,0.2)',
                      '0 18px 40px rgba(0,0,0,0.55)',
                    ].join(', '),
                    marginBottom: '0',
                  }}
                >
                  <StaggeredText
                    text="HEY,"
                    ariaLabel="Hey,"
                    delay={0.28}
                    stagger={0.045}
                  />
                  <br />
                  <StaggeredText
                    text="TIGER"
                    ariaLabel="Tiger"
                    highlightFrom={0}
                    highlightStyle={{ color: '#e8331b' }}
                    delay={0.44}
                    stagger={0.045}
                  />
                </motion.h1>

                {/* Divider line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.82, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    height: '1px',
                    background: 'linear-gradient(to right, rgba(250,175,63,0.55), transparent)',
                    transformOrigin: 'left',
                    margin: 'clamp(16px, 2.2vw, 28px) 0',
                    maxWidth: '280px',
                  }}
                />

                {/* Mini stats strip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.72, duration: 0.55 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: 'clamp(28px, 4vw, 48px)',
                    flexWrap: 'wrap',
                  }}
                >
                  {[
                    { label: 'BAR & RESTAURANT', highlight: false },
                    { label: 'OPEN TILL 4AM', highlight: true },
                    { label: '5 SPACES', highlight: false },
                  ].map(({ label, highlight }, i) => (
                    <Fragment key={label}>
                      {i > 0 && (
                        <span aria-hidden="true" style={{ width: '1px', height: '10px', backgroundColor: 'rgba(250,175,63,0.35)', flexShrink: 0 }} />
                      )}
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(9px, 0.9vw, 12px)',
                        letterSpacing: '0.44em',
                        color: highlight ? '#faaf3f' : 'rgba(245,239,224,0.58)',
                        fontWeight: highlight ? 700 : 600,
                      }}>
                        {label}
                      </span>
                    </Fragment>
                  ))}
                </motion.div>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.02, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}
                >
                  <MagneticButton
                    href="#book"
                    strength={16}
                    glowColor="rgba(250,175,63,0.6)"
                    className="ht-hand-btn"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontWeight: 800,
                      letterSpacing: '0.22em',
                      color: '#0D0D0D',
                      backgroundColor: '#faaf3f',
                      padding: '17px 44px',
                      borderRadius: '40px',
                      textDecoration: 'none',
                      minHeight: '52px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      boxShadow: '0 0 0 0 rgba(250,175,63,0.45), 0 10px 36px rgba(250,175,63,0.35)',
                      animation: 'ht-cta-pulse 2.8s ease-in-out infinite',
                    }}
                  >
                    CLAIM YOUR TABLE →
                  </MagneticButton>
                  <MagneticButton
                    href="#story"
                    strength={12}
                    className="ht-hand-btn"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '0.22em',
                      color: 'rgba(245,239,224,0.75)',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(245,239,224,0.22)',
                      padding: '16px 32px',
                      borderRadius: '40px',
                      textDecoration: 'none',
                      minHeight: '52px',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    STEP INSIDE
                  </MagneticButton>
                </motion.div>

                {/* Quiet Japanese signature */}
                <motion.p
                  lang="ja"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.20 }}
                  transition={{ delay: 1.4, duration: 0.9 }}
                  style={{
                    fontFamily: 'var(--font-jp)',
                    fontSize: 'clamp(11px, 1.1vw, 14px)',
                    letterSpacing: '0.30em',
                    color: 'var(--clr-cream)',
                    marginTop: 'clamp(22px, 2.8vw, 38px)',
                  }}
                >
                  おいトラ
                </motion.p>
              </div>

              {/* Scroll affordance — bottom centre */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                style={{
                  position: 'absolute',
                  bottom: 'clamp(24px, 3.5vh, 40px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  zIndex: 15,
                  pointerEvents: 'none',
                }}
                className="ht-scroll-affordance"
              >
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.5em', color: 'rgba(245,239,224,0.3)' }}>SCROLL</span>
                <span aria-hidden="true" style={{
                  width: '1px',
                  height: '34px',
                  background: 'linear-gradient(to bottom, rgba(201,162,39,0.55), transparent)',
                  animation: 'ht-scroll-bounce 2s ease-in-out infinite',
                  display: 'block',
                }} />
              </motion.div>

              {/* Bottom edge: brand bar with neon rule */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.25, duration: 0.6 }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(to right, transparent 0%, rgba(232,52,26,0.7) 20%, rgba(250,175,63,0.9) 50%, rgba(232,52,26,0.7) 80%, transparent 100%)',
                  zIndex: 16,
                  pointerEvents: 'none',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {phase < 4 && (
          <AnimatePresence>
            {phase === 0 && (
              <motion.div
                key="scroll-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.2, duration: 0.7 }}
                style={{
                  position: 'absolute',
                  bottom: 'clamp(28px, 4vh, 48px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  zIndex: 20,
                  pointerEvents: 'none',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '9px',
                  letterSpacing: '0.52em',
                  fontWeight: 700,
                  color: 'rgba(245,239,224,0.32)',
                }}>SCROLL</span>
                <span
                  aria-hidden="true"
                  style={{
                    width: '1px',
                    height: '36px',
                    background: 'linear-gradient(to bottom, rgba(201,162,39,0.55), transparent)',
                    animation: 'ht-scroll-bounce 2s ease-in-out infinite',
                    display: 'block',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}

export function StoryPosterSection() {
  const ref    = useRef<HTMLElement>(null);
  useInView(ref, { once: true, margin: '-8% 0px' });
  const [taglineActive, setTaglineActive] = useState(false);
  const title = 'THE STORY.';
  const episodeLabel = 'EPISODE 01';
  const illustrationImageUrl = '/herophoto.png';
  const repeatingTagline: string[] = [
    'FAMILY BY DAY',
    'CHAOS BY NIGHT',
    'RAMEN + ROBATA',
    'SUSHI + SAKE',
    'ROOFTOP DJ SETS',
    'RAAAAAAAR CULTURE',
  ];
  const footerLogos = { leftSrc: '/BMH-logo.png', rightSrc: '/heytiger-logo.png' };

  return (
    <section
      ref={ref}
      id="story"
      aria-label="The Story — Episode 1: When the West Meets the East"
      style={{
        background: '#4a5233',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle diagonal grain pattern */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage:
          'repeating-linear-gradient(135deg, rgba(245,239,224,0.018) 0px, rgba(245,239,224,0.018) 1px, transparent 1px, transparent 48px)',
      }} />

      {/* Giant ghost "虎" watermark — right side */}
      <div aria-hidden="true" style={{
        position: 'absolute', right: '-4%', top: '50%',
        transform: 'translateY(-50%)',
        fontFamily: 'var(--font-jp)', fontWeight: 900,
        fontSize: 'clamp(320px, 48vw, 680px)', lineHeight: 1,
        color: 'rgba(245,239,224,0.045)', userSelect: 'none',
        pointerEvents: 'none', zIndex: 0,
      }}>虎</div>

      <div
        style={{
          maxWidth: '1400px', margin: '0 auto',
          padding: 'clamp(72px, 9vw, 120px) clamp(28px, 5vw, 88px)',
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: 'clamp(40px, 6vw, 96px)',
          alignItems: 'center',
          position: 'relative', zIndex: 1,
        }}
        className="story-outer-grid"
      >
        <div
          style={{
            backgroundColor: '#f3e4c2',
            backgroundImage: 'var(--ht-texture-washi)',
            border: '1px solid rgba(243, 228, 194, 0.18)',
            borderRadius: '14px',
            padding: 'clamp(22px, 3vw, 34px)',
            color: 'var(--color-cream)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '520px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
            <h2
              style={{
                fontFamily: 'var(--display-font)',
                fontWeight: 900,
                fontSize: 'clamp(42px, 5.4vw, 78px)',
                lineHeight: 0.92,
                letterSpacing: '-0.02em',
                margin: 0,
                textTransform: 'uppercase',
                color: '#faaf3f',
              }}
            >
              {title}
            </h2>
            <div
              style={{
                position: 'relative',
                width: 'clamp(124px, 10vw, 168px)',
                height: 'clamp(124px, 10vw, 168px)',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid rgba(243, 228, 194, 0.22)',
                flexShrink: 0,
              }}
            >
              <Image src="/heytiger-logo.png" alt="" fill unoptimized sizes="(max-width: 768px) 124px, 168px" style={{ objectFit: 'contain', filter: 'brightness(0) saturate(100%)' }} />
            </div>
          </div>

          <div style={{ marginTop: '22px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="story-columns">
            <div>
              <p
                style={{
                  fontFamily: 'var(--condensed-font)',
                  fontSize: 'clamp(13px, 1.2vw, 15px)',
                  letterSpacing: '0.12em',
                  lineHeight: 1.45,
                  margin: 0,
                  textTransform: 'uppercase',
                  color: '#000000',
                }}
              >
                HEY, TIGER IS YOUR NEIGHBORHOOD JAPANESE SPOT WITH A SPLIT PERSONALITY, IN THE BEST WAY.
                <br />
                <br />
                BY DAY, IT’S A COZY, LAID-BACK FAMILY HAVEN WHERE EVERYONE’S AT EASE.
                <br />
                <br />
                COME 5PM, IT’S CLOCK-OUT O’CLOCK: THE WHITE-COLLAR CREW ROLLS IN, STRESS FOR BEER, AND THE NIGHT TAKES ITS TURN.
                <br />
                <br />
                FAMILY BY DAY. AFTER-HOURS CHAOS BY NIGHT.
              </p>

              <p
                style={{
                  margin: '20px 0 0',
                  fontFamily: 'var(--condensed-font)',
                  fontSize: 'clamp(18px, 2.2vw, 26px)',
                  letterSpacing: '0.12em',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  textTransform: 'uppercase',
                  color: '#faaf3f',
                }}
              >
                COZY, CASUAL, UNPRETENTIOUS, VIBRANT, FAMILIAR, SOCIAL, LATE-NIGHT, FLAVORFUL, FUN.
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
                <p style={{ margin: 0, fontFamily: 'var(--condensed-font)', fontSize: '16px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#faaf3f' }}>
                  {episodeLabel}
                </p>
                <p style={{ margin: 0, fontFamily: 'var(--condensed-font)', fontSize: '16px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#d22f1b' }}>
                  TIGER’S OFFERINGS
                </p>
              </div>

              <p style={{ margin: '10px 0 18px', fontFamily: 'var(--condensed-font)', fontSize: '16px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#faaf3f' }}>
                WHEN THE WEST MEETS THE EAST
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  ['JAPANESE STREET FOOD', 'YAKITORI, KATSU SANDO, RAMEN, SUSHI TACOS, AND MORE.'],
                  ['SUSHI BAR', 'FRESH ROLLS AND CREATIVE SUSHI FUSIONS.'],
                  ['CRAFT COCKTAILS & DRINKS', 'JAPANESE-INSPIRED MIXED DRINKS, BEER, AND SIGNATURE COCKTAILS.'],
                  ['LIVE DJ SETS', 'CURATED BEATS AND VINYL-STYLE SETS FOR A HIGH-ENERGY ROOFTOP VIBE.'],
                  ['ROOFTOP LOUNGE EXPERIENCE', 'URBAN-CHIC SEATING WITH SKYLINE VIEWS AND NEON ENERGY.'],
                ].map(([k, v]) => (
                  <div key={k} style={{ borderLeft: '2px solid rgba(232, 52, 26, 0.65)', paddingLeft: '12px' }}>
                    <p
                      style={{
                        margin: 0,
                        fontFamily: 'var(--condensed-font)',
                        fontSize: '16px',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: '#faaf3f',
                        fontWeight: 700,
                      }}
                    >
                      {k}
                    </p>
                    <p style={{ margin: '6px 0 0', fontFamily: 'var(--condensed-font)', fontSize: '15px', letterSpacing: '0.12em', textTransform: 'uppercase', color: v === 'URBAN-CHIC SEATING WITH SKYLINE VIEWS AND NEON ENERGY.' || v === 'YAKITORI, KATSU SANDO, RAMEN, SUSHI TACOS, AND MORE.' || v === 'FRESH ROLLS AND CREATIVE SUSHI FUSIONS.' || v === 'JAPANESE-INSPIRED MIXED DRINKS, BEER, AND SIGNATURE COCKTAILS.' || v === 'CURATED BEATS AND VINYL-STYLE SETS FOR A HIGH-ENERGY ROOFTOP VIBE.' ? '#000000' : 'rgba(243, 228, 194, 0.78)', lineHeight: 1.35 }}>
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        <figure
          style={{
            margin: 0,
            borderRadius: '14px',
            overflow: 'hidden',
            border: '1px solid rgba(243, 228, 194, 0.18)',
            minHeight: '520px',
            position: 'relative',
          }}
          onMouseEnter={() => setTaglineActive(true)}
          onMouseLeave={() => setTaglineActive(false)}
        >
          <Image src={illustrationImageUrl} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 40vw" style={{ objectFit: 'cover' }} />

          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              right: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            <div style={{ display: 'inline-flex', gap: '10px', alignItems: 'center', background: 'rgba(241,230,205,0.92)', borderRadius: '14px', padding: '10px 12px', border: '1px solid rgba(13,13,13,0.18)' }}>
              <Image
                src="/BMH-logo.png"
                alt=""
                width={110}
                height={46}
                priority
                unoptimized
                style={{ height: '30px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) saturate(100%)', opacity: 0.95 }}
              />
              <Image
                src="/heytiger-logo.png"
                alt=""
                width={110}
                height={46}
                priority
                unoptimized
                style={{ height: '30px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) saturate(100%)', opacity: 0.95 }}
              />
            </div>
          </div>

          <figcaption
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              padding: '22px',
              color: 'rgba(243, 228, 194, 0.9)',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--display-font)', fontWeight: 900, fontSize: '22px', letterSpacing: '-0.01em', textTransform: 'uppercase', color: '#faaf3f' }}>
                HEY, TIGER
              </div>
              <div style={{ fontFamily: 'var(--font-jp)', fontSize: 'clamp(18px, 2vw, 22px)', letterSpacing: '0.2em', marginTop: '4px', color: '#faaf3f' }} lang="ja">
                おいトラ
              </div>
              <div style={{ marginTop: '14px' }}>
                <div style={{
                  overflow: 'hidden',
                  borderTop: '1px solid rgba(243, 228, 194, 0.22)',
                  paddingTop: '10px',
                }}>
                  <div
                    className="ticker-track"
                    style={{
                      animationDuration: taglineActive ? '10s' : '16s',
                      animationDirection: taglineActive ? 'reverse' : 'normal',
                      willChange: 'transform',
                    }}
                  >
                    {repeatingTagline.map((t, i) => (
                      <span
                        key={`${t}-${i}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '14px',
                          paddingRight: '34px',
                          fontFamily: 'var(--condensed-font)',
                          fontSize: '16px',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          lineHeight: 1.25,
                          whiteSpace: 'nowrap',
                          color: i % 2 === 0 ? '#faaf3f' : 'rgba(243, 228, 194, 0.92)',
                        }}
                      >
                        {t}
                        <span style={{ opacity: 0.6 }}>◆</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </figcaption>
        </figure>

        {footerLogos && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 'clamp(28px, 6vw, 64px)',
              right: 'clamp(28px, 6vw, 64px)',
              bottom: '26px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              pointerEvents: 'none',
            }}
          >
            <Image
              src={footerLogos.leftSrc}
              alt=""
              width={220}
              height={100}
              unoptimized
              style={{ height: '44px', width: 'auto', opacity: 0.95, objectFit: 'contain' }}
            />
            <Image
              src={footerLogos.rightSrc}
              alt=""
              width={220}
              height={220}
              unoptimized
              style={{ height: '44px', width: 'auto', opacity: 0.95, objectFit: 'contain' }}
            />
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .story-page { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 768px) {
          .story-page { grid-template-columns: 1fr !important; }
          .story-columns { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) {
          .story-swap { direction: rtl; }
          .story-swap > * { direction: ltr; }
        }
      `}</style>
    </section>
  );
}

/**
 * BeaconIcon — replaces the old PhoneIcon. A glowing red lantern with the
 * tiger kanji 虎 inside. Pulses when "called" (formerly "ringing") to signal
 * the threshold moment in the story. Brand-aligned, no noir baggage.
 */
function PhoneIcon({ ringing }: { ringing: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '88px',
        height: '88px',
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        position: 'relative',
        // Lantern glow background — warm amber → red gradient
        background: ringing
          ? 'radial-gradient(circle at 50% 45%, rgba(250,175,63,0.45) 0%, rgba(232,52,26,0.55) 55%, rgba(232,52,26,0.18) 100%)'
          : 'radial-gradient(circle at 50% 45%, rgba(250,175,63,0.18) 0%, rgba(232,52,26,0.18) 60%, rgba(232,52,26,0) 100%)',
        border: `1.5px solid ${ringing ? 'rgba(232,52,26,0.9)' : 'rgba(250,175,63,0.4)'}`,
        boxShadow: ringing
          ? '0 0 32px rgba(232,52,26,0.55), inset 0 0 24px rgba(250,175,63,0.35)'
          : '0 0 18px rgba(232,52,26,0.18), inset 0 0 12px rgba(250,175,63,0.12)',
        transition: 'background 0.5s, border-color 0.5s, box-shadow 0.5s',
      }}
    >
      {/* Tiger kanji — the brand mark glowing inside the lantern */}
      <span
        lang="ja"
        style={{
          fontFamily: 'var(--font-jp)',
          fontSize: '44px',
          lineHeight: 1,
          fontWeight: 900,
          color: ringing ? '#FFD179' : 'rgba(224,211,180,0.85)',
          textShadow: ringing
            ? '0 0 16px rgba(255,209,121,0.85), 0 0 32px rgba(232,52,26,0.6)'
            : '0 0 8px rgba(232,52,26,0.4)',
          transition: 'color 0.5s, text-shadow 0.5s',
        }}
      >
        虎
      </span>
    </div>
  );
}
