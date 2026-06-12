'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import FilmGrain from './FilmGrain';
import LetterboxBars from './LetterboxBars';

const EmberCanvas = dynamic(() => import('@/three/EmberCanvas'), { ssr: false });

interface Props {
  onComplete?: () => void;
}

const LUXURY: [number, number, number, number] = [0.76, 0, 0.24, 1];
const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const up = (delay: number) => ({
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: SOFT, delay } },
});

const CREDITS = [
  'A BRASS MONKEY HOSPITALITY VENUE',
  'CONCEPT · BRASS MONKEY GROUP  ·  LOCATION · MOTOR CITY CLUB HOUSE',
  'CUISINE · JAPANESE IZAKAYA  ·  SAKE · 47 LABELS  ·  EST. 2025',
  'OPEN TILL 2AM  ·  TUE – SUN  ·  DUBAI, UAE',
];

const TICKER = 'おいトラ · MOTOR CITY DUBAI · OPEN TILL 2AM · 47 SAKE LABELS · RAAAAAAR CULTURE · ';

export default function HeroCinematic({ onComplete }: Props) {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), 3200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <section
      id="hero"
      aria-label="Hey Tiger — Hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#0a0a08',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* BG IMAGE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.35 }}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-interior.jpg"
          alt=""
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'brightness(0.38) saturate(0.75)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg,rgba(10,10,8,0.65) 0%,rgba(40,12,0,0.2) 50%,rgba(10,10,8,0.8) 100%)',
          }}
        />
      </motion.div>

      {/* Signature three.js moment — rising embers, additive glow */}
      <EmberCanvas
        density={1}
        span={7}
        spread={[10, 4]}
        colorHot="#f5c089"
        colorCool="#c83d20"
        opacity={0.85}
        parallax={0.5}
        style={{ zIndex: 1 }}
      />

      <FilmGrain />
      <LetterboxBars />

      {/* CONTENT */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 clamp(1.5rem,4vw,4rem)',
          width: '100%',
          maxWidth: '960px',
        }}
      >
        {/* Eyebrow */}
        <motion.p
          variants={up(0.85)}
          initial="hidden"
          animate="show"
          lang="ja"
          style={{
            fontFamily: "var(--font-body,'Helvetica Neue',sans-serif)",
            fontSize: '0.65rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(232,82,26,0.9)',
            margin: '0 0 1.5rem',
          }}
        >
          ヘイ、タイガー &nbsp;——&nbsp; MOTOR CITY · DUBAI
        </motion.p>

        {/* Hero kanji — clip reveal */}
        <div style={{ overflow: 'hidden' }}>
          <motion.h1
            lang="ja"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 1.3, ease: LUXURY, delay: 1.1 }}
            style={{
              fontFamily: "var(--font-japanese-serif,'Noto Serif JP',serif)",
              fontSize: 'clamp(4.5rem,17vw,17rem)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.05em',
              lineHeight: 1,
              margin: 0,
              whiteSpace: 'nowrap',
            }}
          >
            おいトラ
          </motion.h1>
        </div>

        {/* Rule + subtitle */}
        <motion.div
          variants={up(1.65)}
          initial="hidden"
          animate="show"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', marginTop: '1.4rem' }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.0, ease: LUXURY, delay: 1.75 }}
            style={{ width: '200px', height: '1px', background: 'rgba(255,255,255,0.25)', transformOrigin: 'left center' }}
          />
          <p
            style={{
              fontFamily: "var(--font-body,'Helvetica Neue',sans-serif)",
              fontSize: '0.72rem',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              margin: 0,
            }}
          >
            RAAAAAAR CULTURE
          </p>
        </motion.div>

        {/* Film credits */}
        <motion.div
          variants={up(2.05)}
          initial="hidden"
          animate="show"
          style={{ marginTop: '1.8rem', display: 'flex', flexDirection: 'column' }}
        >
          {CREDITS.map((line: string, i: number) => (
            <p
              key={i}
              style={{
                fontFamily: "'Courier New',monospace",
                fontSize: '0.56rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)',
                margin: 0,
                lineHeight: 2.0,
              }}
            >
              {line}
            </p>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={up(2.45)}
          initial="hidden"
          animate="show"
          style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginTop: '2.5rem' }}
        >
          <a
            href="https://www.sevenrooms.com/reservations/heytigerdubai"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-block',
              padding: '0.8rem 2rem',
              background: '#ffffff',
              color: '#0a0a08',
              fontFamily: "var(--font-body,'Helvetica Neue',sans-serif)",
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid #fff',
              transition: 'all 0.25s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = '#e8521a';
              el.style.borderColor = '#e8521a';
              el.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = '#fff';
              el.style.borderColor = '#fff';
              el.style.color = '#0a0a08';
            }}
          >
            BOOK A TABLE →
          </a>
          <Link
            href="#explore"
            style={{
              fontFamily: "var(--font-body,'Helvetica Neue',sans-serif)",
              fontSize: '0.68rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#fff')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)')}
          >
            EXPLORE
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.1, duration: 0.7 }}
        style={{
          position: 'absolute',
          bottom: '58px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
          zIndex: 5,
        }}
      >
        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '1.5px', height: '38px', background: 'rgba(255,255,255,0.35)' }}
        />
        <p
          style={{
            fontFamily: "var(--font-body,'Helvetica Neue',sans-serif)",
            fontSize: '0.52rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            margin: 0,
          }}
        >
          SCROLL
        </p>
      </motion.div>

      {/* Ticker */}
      <div
        style={{
          position: 'absolute',
          bottom: '44px',
          left: 0,
          right: 0,
          zIndex: 6,
          overflow: 'hidden',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '6px 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            animation: 'htTicker 30s linear infinite',
            fontFamily: "var(--font-body,'Helvetica Neue',sans-serif)",
            fontSize: '0.6rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          {Array(8)
            .fill(TICKER)
            .map((t: string, i: number) => (
              <span key={i} style={{ paddingRight: '1rem' }}>
                {t}
              </span>
            ))}
        </div>
      </div>

      <style>{`@keyframes htTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </section>
  );
}
