'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

import EmberParticles from '@/components/EmberParticles';
import { useLoaderDone } from '@/hooks/useLoaderDone';

/**
 * HeroSection — first-fold hero for Hey Tiger.
 *
 * Adapts a BUNO-style poster layout to the brand: a giant ghosted display word
 * ("TIGER", --font-anton) sits behind the oversized tiger badge, which bleeds
 * off the right edge with a left-side orange rim-light (drop-shadow). Warm ember
 * sparks drift up over it all; a brush-energy headline stacks at top-left and a
 * marquee ticker runs along the bottom.
 *
 * Entrances are gated on useLoaderDone() — the Loader flips it true at ~60% of
 * the curtain wipe — then staggered per the design timeline. All decorative
 * layers are aria-hidden; the page's real <h1> lives (sr-only) in page.tsx.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export default function HeroSection({
  onReserve,
  onExplore,
}: {
  onReserve: () => void;
  onExplore: () => void;
}) {
  const reduceMotion = !!useReducedMotion();
  const ready = useLoaderDone();

  // Fade-up entrance, reused across the foreground stack. `delay` per element.
  const rise: Variants = useMemo(
    () => ({
      hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
      show: (delay: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: EASE, delay },
      }),
    }),
    [reduceMotion],
  );

  const anim = (delay: number) => ({
    variants: rise,
    custom: delay,
    initial: 'hidden' as const,
    animate: ready ? 'show' : 'hidden',
  });

  return (
    <section id="hero" aria-label="Hey Tiger — Hero" className="ht-hero">
      {/* ── Visual stage: giant ghost word + tiger badge (decorative) ── */}
      <div className="ht-hero-stage" aria-hidden="true">
        <motion.span
          className="ht-hero-bgword"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: ready ? 0.15 : 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          TIGER
        </motion.span>

        {/* outer wrapper owns centering + size + rim-light; inner owns the
            entrance, so Motion's transform never clobbers translateY(-50%) */}
        <div className="ht-hero-tiger">
          <motion.div
            className="ht-hero-tiger-inner"
            initial={reduceMotion ? false : { opacity: 0, x: 80 }}
            animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            <Image
              src="/tiger-mascot.png"
              alt=""
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 90vw, 60vw"
              style={{ objectFit: 'contain', objectPosition: 'center' }}
            />
          </motion.div>
        </div>
      </div>

      {/* ── Ember spark field — starts ~900ms after the reveal ── */}
      <EmberParticles active={ready} startDelay={900} />

      {/* ── Foreground content ── */}
      <div className="ht-hero-grid">
        <div className="ht-hero-content">
          <motion.p {...anim(0.2)} className="ht-hero-label" lang="ja">
            おいトラ<span className="ht-hero-dot">·</span>MOTOR CITY DUBAI
          </motion.p>

          <div className="ht-hero-headline" role="presentation">
            <motion.span {...anim(0.32)} style={{ skewX: -7 }} className="ht-hero-brush">
              WE ARE
            </motion.span>
            <motion.span
              {...anim(0.44)}
              style={{ skewX: -7 }}
              className="ht-hero-brush ht-hero-brush--xl"
            >
              RAAAAAR
            </motion.span>
            <motion.span {...anim(0.56)} style={{ skewX: -7 }} className="ht-hero-brush">
              CULTURE<span className="ht-hero-period">.</span>
            </motion.span>
          </div>

          <motion.div {...anim(0.7)} className="ht-hero-actions">
            <motion.button
              type="button"
              string="magnetic"
              string-factor="0.3"
              onClick={onReserve}
              whileHover={reduceMotion ? {} : { y: -2 }}
              className="ht-hero-cta"
            >
              BOOK TABLE <span aria-hidden="true">→</span>
            </motion.button>

            <button type="button" onClick={onExplore} className="ht-hero-explore">
              EXPLORE
            </button>
          </motion.div>
        </div>

        {/* right grid cell intentionally empty — the tiger lives on the stage */}
        <div aria-hidden="true" />
      </div>

      {/* ── Bottom marquee ticker ── */}
      <div className="ht-hero-ticker" aria-hidden="true">
        <div className="ht-hero-ticker-track">
          {Array.from({ length: 2 }).map((_, copy) => (
            <span className="ht-hero-ticker-seg" key={copy}>
              {Array.from({ length: 6 }).map((__, i) => (
                <span key={i}>
                  RAAAAAAR CULTURE&nbsp;·&nbsp;おいトラ&nbsp;·&nbsp;MOTOR CITY DUBAI&nbsp;·&nbsp;OPEN
                  TILL 2AM&nbsp;·&nbsp;47 SAKE LABELS&nbsp;·&nbsp;
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .ht-hero {
          position: relative;
          width: 100%;
          height: 100dvh;
          min-height: 600px;
          background: var(--clr-void);
          overflow: hidden;
          display: grid;
        }

        /* Visual stage — full-bleed layer behind the content */
        .ht-hero-stage {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          pointer-events: none;
        }

        /* Giant ghost word — condensed grotesk, vertically centred, right-aligned */
        .ht-hero-bgword {
          position: absolute;
          right: -4%;
          top: 50%;
          transform: translateY(-50%);
          font-family: var(--font-anton);
          font-weight: 400;
          font-size: clamp(14rem, 30vw, 30rem);
          line-height: 0.8;
          letter-spacing: -0.02em;
          color: var(--clr-red);
          white-space: nowrap;
          z-index: 1;
          user-select: none;
        }

        /* Tiger badge — oversized, bleeds off the right, left-side rim light.
           Outer owns centering + size + filter; inner owns the entrance. */
        .ht-hero-tiger {
          position: absolute;
          right: -12%;
          top: 50%;
          width: clamp(640px, 88vh, 1180px);
          height: clamp(640px, 88vh, 1180px);
          transform: translateY(-50%);
          z-index: 2;
          filter: drop-shadow(-30px 0 80px rgba(224, 86, 40, 0.5))
                  drop-shadow(-8px 0 24px rgba(224, 86, 40, 0.35));
        }
        .ht-hero-tiger-inner {
          position: absolute;
          inset: 0;
          will-change: transform, opacity;
        }

        /* Content grid — text left, tiger (on stage) shows through right */
        .ht-hero-grid {
          position: relative;
          z-index: 10;
          height: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          pointer-events: none;
        }
        .ht-hero-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: clamp(14px, 2.4vh, 26px);
          padding: clamp(2rem, 6vw, 6rem);
          padding-right: 0;
          pointer-events: auto;
        }

        .ht-hero-label {
          font-family: var(--font-body);
          font-size: clamp(0.72rem, 1vw, 0.82rem);
          font-weight: 800;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--amber-wood);
          display: flex;
          align-items: center;
        }
        .ht-hero-dot { margin: 0 0.7em; opacity: 0.6; }

        .ht-hero-headline {
          display: flex;
          flex-direction: column;
          gap: 0.02em;
        }
        .ht-hero-brush {
          display: inline-block;
          font-family: var(--font-anton);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(3.4rem, 8vw, 7.2rem);
          line-height: 0.92;
          letter-spacing: -0.01em;
          color: #FFFFFF;
          transform-origin: left bottom;
          text-shadow: 3px 3px 0 rgba(200, 61, 32, 0.28),
                       -1px -1px 0 rgba(61, 122, 110, 0.18);
        }
        .ht-hero-brush--xl {
          font-size: clamp(4.4rem, 10.5vw, 9.4rem);
          -webkit-text-stroke: 1.5px #FFFFFF;
          color: transparent;
          text-shadow: 4px 4px 0 rgba(200, 61, 32, 0.32);
        }
        .ht-hero-period { color: var(--clr-red); -webkit-text-stroke: 0; }

        .ht-hero-actions {
          display: flex;
          align-items: center;
          gap: clamp(14px, 2vw, 26px);
          margin-top: clamp(10px, 2vh, 22px);
          flex-wrap: wrap;
        }
        .ht-hero-cta {
          background: var(--clr-red);
          color: var(--clr-void);
          border: 0;
          border-radius: 0;
          padding: 16px 30px;
          min-height: 44px;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: var(--text-label);
          font-weight: 900;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          transition: background var(--dur-fast) var(--ease-standard),
                      color var(--dur-fast) var(--ease-standard);
          white-space: nowrap;
        }
        .ht-hero-cta:hover,
        .ht-hero-cta:focus-visible {
          background: var(--clr-cream);
          color: var(--clr-void);
        }
        .ht-hero-explore {
          background: transparent;
          border: 0;
          border-radius: 0;
          padding: 14px 6px;
          min-height: 44px;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: var(--text-label);
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--clr-cream-70);
          text-decoration: underline;
          text-underline-offset: 5px;
          text-decoration-color: var(--clr-cream-30);
          transition: color var(--dur-fast) var(--ease-standard);
        }
        .ht-hero-explore:hover,
        .ht-hero-explore:focus-visible { color: var(--clr-cream); }

        /* Bottom ticker */
        .ht-hero-ticker {
          position: absolute;
          left: 0;
          right: 0;
          bottom: clamp(14px, 3vh, 28px);
          z-index: 10;
          overflow: hidden;
          pointer-events: none;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
                  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
        }
        .ht-hero-ticker-track {
          display: flex;
          width: max-content;
          animation: ht-hero-marquee 30s linear infinite;
        }
        .ht-hero-ticker-seg {
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(240, 235, 216, 0.25);
          white-space: nowrap;
          padding-right: 0; /* segments already end with a separator */
        }
        @keyframes ht-hero-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ── Mobile: single column, tiger ghosts behind the text ── */
        @media (max-width: 768px) {
          .ht-hero-grid { grid-template-columns: 1fr; }
          .ht-hero-content { padding: clamp(1.4rem, 7vw, 2.6rem); padding-bottom: 16vh; }
          .ht-hero-bgword { font-size: clamp(8rem, 30vw, 14rem); right: -6%; }
          .ht-hero-tiger {
            right: -22%;
            top: auto;
            bottom: 0;
            transform: none;
            width: 86vh;
            height: 86vh;
            opacity: 0.4 !important;
          }
          .ht-hero-brush { font-size: clamp(3rem, 15vw, 5.4rem); }
          .ht-hero-brush--xl { font-size: clamp(3.8rem, 19vw, 7rem); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ht-hero-ticker-track { animation: none; }
          .ht-hero-tiger { filter: drop-shadow(-20px 0 60px rgba(224, 86, 40, 0.4)); }
        }
      `}</style>
    </section>
  );
}
