// ARCHIVED — possibly used on secondary pages.
// Confirm usage before restoring. Do not import from active components.
// Archived: 2026-05-31
'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
/* ── Sound lines — radiating from both edges ── */
const LEFT_LINES = [
  { text: 'ガオガオ〜 略略略〜', rotate: -72, top: '8%'  },
  { text: 'RAWR〜 ガオ〜',      rotate: -56, top: '19%' },
  { text: 'ガォ〜 RAAAAAR〜',   rotate: -42, top: '30%' },
  { text: 'ガオガオ〜 略略略〜', rotate: -28, top: '42%' },
  { text: 'RAWR〜 ガォ〜',      rotate: -16, top: '54%' },
  { text: 'ガオガオ〜 略略略〜', rotate:  -7, top: '64%' },
  { text: 'ガォ〜 RAAAAAR〜',   rotate:  -2, top: '74%' },
];
const RIGHT_LINES = [
  { text: '〜略略略 〜ガオガオ', rotate:  72, top: '8%'  },
  { text: '〜ガォ RAWR〜',      rotate:  56, top: '19%' },
  { text: '〜RAAAAAR 〜ガォ',   rotate:  42, top: '30%' },
  { text: '〜略略略 〜ガオガオ', rotate:  28, top: '42%' },
  { text: '〜ガォ RAWR〜',      rotate:  16, top: '54%' },
  { text: '〜略略略 〜ガオガオ', rotate:   7, top: '64%' },
  { text: '〜RAAAAAR 〜ガォ',   rotate:   2, top: '74%' },
];

export default function HeroSection({
  onReserve,
  reduceMotion,
}: {
  onReserve: () => void;
  reduceMotion: boolean;
}) {
  const kanjiRef = useRef<HTMLSpanElement>(null);

  /* Projector flicker on the kanji */
  useEffect(() => {
    if (reduceMotion || !kanjiRef.current) return;
    const el = kanjiRef.current;
    let raf: number;
    let last = 0;
    const pending: ReturnType<typeof setTimeout>[] = [];

    const flicker = (t: number) => {
      raf = requestAnimationFrame(flicker);
      if (t - last < 3200 + Math.random() * 5000) return;
      last = t;
      const frames = [1, 0.84, 1, 0.91, 1, 0.78, 1, 0.96, 1];
      frames.forEach((v, i) => {
        pending.push(setTimeout(() => { el.style.opacity = String(v); }, i * 38));
      });
      if (pending.length > 100) pending.splice(0, pending.length - 50);
    };
    raf = requestAnimationFrame(flicker);
    return () => {
      cancelAnimationFrame(raf);
      pending.forEach(clearTimeout);
    };
  }, [reduceMotion]);

  return (
    <section
      id="hero"
      aria-label="Hey Tiger — Landing"
      style={{
        background: '#C54834',
        height: '100dvh',
        minHeight: '600px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* ── SVG filter definitions ── */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          {/* Chromatic aberration */}
          <filter id="ht-chroma" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feOffset dx="3" dy="0" in="SourceGraphic" result="r" />
            <feColorMatrix in="r" type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 0" result="red" />
            <feOffset dx="-3" dy="1" in="SourceGraphic" result="b" />
            <feColorMatrix in="b" type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 0.45 0" result="blu" />
            <feBlend in="SourceGraphic" in2="red" mode="screen" result="cr" />
            <feBlend in="cr" in2="blu" mode="screen" />
          </filter>
          {/* Screen-print roughness */}
          <filter id="ht-print" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.065 0.065" numOctaves="4" seed="8" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>


      {/* ── BACKGROUND KANJI 虎 — very dark, barely visible ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2, pointerEvents: 'none',
      }}>
        <span
          ref={kanjiRef}
          style={{
            fontFamily: 'var(--font-jp)',
            fontSize: 'clamp(300px, 58vw, 760px)',
            fontWeight: 900,
            color: 'rgba(0,0,0,0.1)',
            lineHeight: 1,
            userSelect: 'none',
            letterSpacing: '-0.04em',
            filter: 'url(#ht-print)',
            opacity: 1,
          }}
        >虎</span>
      </div>

      {/* ── LEFT SOUND LINES ── */}
      {LEFT_LINES.map((l, i) => (
        <div key={`l${i}`} aria-hidden="true" style={{
          position: 'absolute', top: l.top, left: 0,
          transform: `rotate(${l.rotate}deg)`,
          transformOrigin: 'left center', zIndex: 5, pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: 'var(--font-jp)',
            fontSize: 'clamp(14px, 1.6vw, 22px)',
            fontWeight: 900,
            color: '#FFD01F',
            whiteSpace: 'nowrap',
            letterSpacing: '0.08em',
            opacity: 0.32,
          }}>{l.text}</span>
        </div>
      ))}

      {/* ── RIGHT SOUND LINES ── */}
      {RIGHT_LINES.map((r, i) => (
        <div key={`r${i}`} aria-hidden="true" style={{
          position: 'absolute', top: r.top, right: 0,
          transform: `rotate(${r.rotate}deg)`,
          transformOrigin: 'right center', zIndex: 5, pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: 'var(--font-jp)',
            fontSize: 'clamp(14px, 1.6vw, 22px)',
            fontWeight: 900,
            color: '#FFD01F',
            whiteSpace: 'nowrap',
            letterSpacing: '0.08em',
            opacity: 0.32,
          }}>{r.text}</span>
        </div>
      ))}

      {/* ── TIGER — full viewport height, reaches the bottom ── */}
      <motion.div
        initial={reduceMotion ? {} : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0, right: 0,
          margin: '0 auto',
          top: 0,
          bottom: 0,
          width: 'clamp(340px, 64vw, 880px)',
          zIndex: 4,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/tiger.png"
          alt="Tiger"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center bottom',
            display: 'block',
            filter: `
              url(#ht-chroma)
              contrast(1.4)
              brightness(1.1)
              saturate(0.75)
              drop-shadow(0 24px 64px rgba(0,0,0,0.65))
              drop-shadow(0 4px 12px rgba(0,0,0,0.45))
            `,
          }}
        />
        {/* Grain overlay on tiger */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundSize: '160px 160px',
          opacity: 0.14,
          mixBlendMode: 'overlay',
        }} />
      </motion.div>

      {/* ── EDITORIAL HEADLINE — top center, YELLOW on RED ── */}
      <motion.div
        initial={reduceMotion ? {} : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          top: 'clamp(80px, 11vw, 144px)',
          left: 0, right: 0,
          zIndex: 8,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(9px, 0.85vw, 12px)',
          fontWeight: 900, letterSpacing: '0.52em',
          color: 'rgba(255,208,31,0.65)', margin: '0 0 14px',
          textIndent: '0.52em',
        }}>MOTOR CITY DUBAI · OPENING 2026</p>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(52px, 10vw, 130px)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          color: '#FFD01F',
          lineHeight: 0.9,
          margin: 0,
          whiteSpace: 'nowrap',
          textShadow: '3px 5px 0 rgba(0,0,0,0.22), 0 0 80px rgba(255,208,31,0.25)',
          filter: 'url(#ht-print)',
        }}>
          HEY, TIGER
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(12px, 1.35vw, 17px)',
          fontWeight: 700, letterSpacing: '0.22em',
          color: 'rgba(255,208,31,0.72)',
          margin: 'clamp(14px, 2.2vw, 24px) 0 0',
          textTransform: 'uppercase',
        }}>Your neighborhood Japanese bar</p>
      </motion.div>

      {/* ── BOTTOM VIGNETTE — fades to the dark section below ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 'clamp(200px, 36vh, 340px)',
        background: 'linear-gradient(to top, rgba(17,17,17,1.0) 0%, rgba(17,17,17,0.88) 22%, rgba(80,20,10,0.35) 55%, transparent 100%)',
        zIndex: 7, pointerEvents: 'none',
      }} />

      {/* ── BOTTOM BAR — CTA + editorial info brackets ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        padding: '0 clamp(14px, 3.5vw, 44px) clamp(20px, 2.5vw, 34px)',
        zIndex: 8,
      }}>

        {/* Left info bracket */}
        <div style={{
          fontFamily: 'var(--font-jp)',
          fontSize: 'clamp(9px, 0.85vw, 11px)',
          color: 'rgba(255,208,31,0.88)',
          border: '1.5px solid rgba(255,208,31,0.35)',
          padding: '7px 12px',
          letterSpacing: '0.04em', lineHeight: 1.7, flexShrink: 0,
        }}>
          <div>（虎の自己修養）</div>
          <div style={{ opacity: 0.5, fontSize: '8px', marginTop: '2px' }}>○自我修養○</div>
        </div>

        {/* Center — BOOK CTA */}
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', flex: 1, padding: '0 clamp(12px, 2.5vw, 36px)' }}
        >
          <button
            onClick={onReserve}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(11px, 1vw, 14px)',
              fontWeight: 900, letterSpacing: '0.32em',
              color: '#1b0e20', background: '#FFD01F',
              border: 'none', borderRadius: '40px',
              padding: 'clamp(13px, 1.4vh, 19px) clamp(26px, 3vw, 42px)',
              cursor: 'pointer', transition: 'background 0.2s, transform 0.15s',
              minHeight: '48px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#E8B800';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#FFD01F';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >BOOK A TABLE →</button>
        </motion.div>

        {/* Right info bracket */}
        <div style={{
          fontFamily: 'var(--font-jp)',
          fontSize: 'clamp(9px, 0.85vw, 11px)',
          color: 'rgba(255,208,31,0.8)',
          border: '1.5px solid rgba(255,208,31,0.32)',
          padding: '7px 12px',
          letterSpacing: '0.04em', lineHeight: 1.7, textAlign: 'right', flexShrink: 0,
        }}>
          <div>（RAAAAAAR）</div>
          <div style={{ opacity: 0.5, fontSize: '8px', marginTop: '2px' }}>○文化修養○</div>
        </div>
      </div>
    </section>
  );
}
