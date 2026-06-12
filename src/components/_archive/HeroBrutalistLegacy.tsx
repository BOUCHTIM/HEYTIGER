'use client';

import Link from 'next/link';

interface Props {
  onReserve: () => void;
}

/**
 * HeroBrutalist — landing hero.
 *
 * White-paper poster: huge HEY TIGER headline, a tilted red tagline block,
 * a torn-paper collage of bordered cards on the right, and a brutalist
 * info strip along the bottom. Colour (red / cream-beige / olive) is used
 * only for blocks, borders, chips and the marquee — the canvas stays
 * var(--ht-cream).
 */
export default function HeroBrutalist({ onReserve }: Props) {
  return (
    <section id="hero" aria-label="Hey Tiger — Hero" className="ht-brutal">
      <div className="ht-brutal-grid">
        {/* ── Left: headline stack ── */}
        <div className="ht-brutal-left">
          <p className="ht-brutal-eyebrow" lang="ja">
            ヘイ・タイガー <span aria-hidden="true">—</span> MOTOR CITY · DUBAI
          </p>

          <h1 className="ht-brutal-h1">
            HEY
            <br />
            TIGER
          </h1>

          <div className="ht-brutal-tagline">
            FAMILY BY DAY
            <br />
            CHAOS BY NIGHT.
          </div>

          <p className="ht-brutal-sub">
            Japanese-inspired bar &amp; restaurant in Motor City — sake, skewers,
            loud tables, and a kitchen that never apologises.
          </p>

          <div className="ht-brutal-ctas">
            <button type="button" onClick={onReserve} className="ht-brutal-cta-solid">
              BOOK A TABLE <span aria-hidden="true">→</span>
            </button>
            <Link href="/menu" className="ht-brutal-cta-ghost">
              VIEW MENU
            </Link>
          </div>
        </div>

        {/* ── Right: brutalist collage ── */}
        <div className="ht-brutal-collage" aria-hidden="true">
          <span className="ht-brutal-block ht-brutal-block--jp" lang="ja">
            おいトラ
          </span>
          <span className="ht-brutal-sticker">RAAAAAAR CULTURE</span>
          <span className="ht-brutal-block ht-brutal-block--dark">
            MOTOR CITY
            <br />
            CLUBHOUSE
          </span>
          <span className="ht-brutal-badge">OPEN TILL 2AM</span>
        </div>
      </div>

      {/* ── Info strip ── */}
      <div className="ht-brutal-strip" aria-hidden="true">
        <div className="ht-brutal-strip-cell ht-brutal-strip-cell--marquee">
          <div className="ht-brutal-marquee-track">
            {Array.from({ length: 2 }).map((_, copy) => (
              <span key={copy} className="ht-brutal-marquee-seg">
                {Array.from({ length: 4 }).map((__, i) => (
                  <span key={i}>RAAAAAAR&nbsp;·&nbsp;</span>
                ))}
              </span>
            ))}
          </div>
        </div>
        <div className="ht-brutal-strip-cell">OPEN TILL 2AM</div>
        <div className="ht-brutal-strip-cell">47 SAKE LABELS</div>
        <div className="ht-brutal-strip-cell">MOTOR CITY CLUBHOUSE · DUBAI</div>
      </div>

      {/* ── Scroll cue ── */}
      <Link href="#explore" className="ht-brutal-scroll" aria-label="Scroll to explore">
        <span className="ht-brutal-scroll-dot" />
        SCROLL
      </Link>

      <style>{`
        .ht-brutal {
          position: relative;
          width: 100%;
          min-height: 100dvh;
          background: var(--ht-cream);
          color: var(--ht-void);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(1.5rem, 4vw, 4rem);
          padding-bottom: clamp(4.5rem, 8vw, 6.5rem);
          overflow: hidden;
        }

        /* ── Grid ── */
        .ht-brutal-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: clamp(2rem, 5vw, 4rem);
          align-items: center;
          flex: 1;
        }

        .ht-brutal-left {
          display: flex;
          flex-direction: column;
          gap: clamp(1rem, 2vw, 1.4rem);
        }

        .ht-brutal-eyebrow {
          font-family: var(--font-body);
          font-size: clamp(0.62rem, 0.9vw, 0.76rem);
          font-weight: 800;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--ht-red);
          margin: 0;
        }
        .ht-brutal-eyebrow span { opacity: 0.5; margin: 0 0.5em; }

        .ht-brutal-h1 {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: clamp(4.2rem, 13vw, 9rem);
          line-height: 0.92;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: var(--ht-void);
          margin: 0;
        }

        /* tilted brutalist tagline block — hard border, flat red, no gradient */
        .ht-brutal-tagline {
          display: inline-block;
          align-self: flex-start;
          background: var(--ht-red);
          color: var(--ht-cream);
          border: 2px solid var(--ht-void);
          padding: clamp(0.7rem, 1.4vw, 1.1rem) clamp(1rem, 2vw, 1.6rem);
          font-family: var(--font-display);
          font-weight: 900;
          font-size: clamp(1.2rem, 2.6vw, 1.9rem);
          line-height: 1.08;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          transform: rotate(-2deg);
          box-shadow: 5px 5px 0 var(--ht-void);
        }

        .ht-brutal-sub {
          font-family: var(--font-body);
          font-size: clamp(0.85rem, 1.2vw, 1.05rem);
          line-height: 1.55;
          color: var(--ht-void);
          opacity: 0.75;
          max-width: 34ch;
          margin: 0;
        }

        /* ── CTAs ── */
        .ht-brutal-ctas {
          display: flex;
          align-items: center;
          gap: clamp(0.8rem, 2vw, 1.4rem);
          flex-wrap: wrap;
          margin-top: clamp(0.4rem, 1vw, 0.8rem);
        }

        .ht-brutal-cta-solid {
          display: inline-flex;
          align-items: center;
          gap: 0.6em;
          background: var(--ht-void);
          color: var(--ht-cream);
          border: 2px solid var(--ht-void);
          border-radius: 0;
          padding: 1rem 2rem;
          min-height: 44px;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        .ht-brutal-cta-solid:hover,
        .ht-brutal-cta-solid:focus-visible {
          background: var(--ht-red);
          border-color: var(--ht-void);
          transform: translate(-3px, -3px);
          box-shadow: 5px 5px 0 var(--ht-void);
        }

        .ht-brutal-cta-ghost {
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          padding: 1rem 1.6rem;
          border: 2px solid var(--ht-void);
          border-radius: 0;
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--ht-void);
          text-decoration: none;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, color 0.15s ease;
        }
        .ht-brutal-cta-ghost:hover,
        .ht-brutal-cta-ghost:focus-visible {
          background: var(--ht-void);
          color: var(--ht-cream);
          transform: translate(-3px, -3px);
          box-shadow: 5px 5px 0 var(--ht-amber);
        }

        /* ── Collage ── */
        .ht-brutal-collage {
          position: relative;
          height: clamp(320px, 44vw, 480px);
          pointer-events: none;
        }

        .ht-brutal-block,
        .ht-brutal-sticker,
        .ht-brutal-badge {
          position: absolute;
          border: 2px solid var(--ht-void);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .ht-brutal-block--jp {
          top: 4%;
          right: 6%;
          width: clamp(160px, 22vw, 260px);
          height: clamp(160px, 22vw, 260px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--ht-cream);
          color: var(--ht-void);
          font-family: var(--font-japanese-serif, 'Noto Serif JP', serif);
          font-size: clamp(3rem, 6vw, 4.6rem);
          font-weight: 700;
          line-height: 1;
          writing-mode: vertical-rl;
          rotate: 3deg;
          box-shadow: 8px 8px 0 var(--ht-sand-2);
        }

        .ht-brutal-sticker {
          top: 38%;
          left: 0;
          background: var(--ht-red);
          color: var(--ht-cream);
          padding: 0.6rem 1.1rem;
          font-family: var(--font-display);
          font-weight: 900;
          font-size: clamp(0.85rem, 1.6vw, 1.15rem);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transform: rotate(-7deg);
          box-shadow: 6px 6px 0 var(--ht-void);
        }

        .ht-brutal-block--dark {
          bottom: 6%;
          right: 10%;
          width: clamp(150px, 20vw, 220px);
          padding: 1.2rem 1.4rem;
          background: var(--ht-void);
          color: var(--ht-cream);
          font-family: var(--font-body);
          font-weight: 800;
          font-size: clamp(0.7rem, 1.1vw, 0.85rem);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          line-height: 1.6;
          transform: rotate(2deg);
          box-shadow: 6px 6px 0 var(--ht-red);
        }

        .ht-brutal-badge {
          bottom: 14%;
          left: 14%;
          background: var(--ht-olive);
          color: var(--ht-cream);
          border-radius: 999px;
          padding: 0.55rem 1.2rem;
          font-family: var(--font-body);
          font-weight: 800;
          font-size: 0.66rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          transform: rotate(-4deg);
          box-shadow: 5px 5px 0 var(--ht-void);
        }

        /* hover lift — slight unrotate + harder shadow */
        .ht-brutal-collage:hover .ht-brutal-block--jp,
        .ht-brutal-collage:hover .ht-brutal-sticker,
        .ht-brutal-collage:hover .ht-brutal-block--dark,
        .ht-brutal-collage:hover .ht-brutal-badge {
          transform: rotate(0deg) translate(-2px, -2px);
        }

        /* ── Bottom info strip ── */
        .ht-brutal-strip {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.4fr;
          border-top: 2px solid var(--ht-void);
        }

        .ht-brutal-strip-cell {
          border-right: 2px solid var(--ht-void);
          padding: 0.7rem clamp(0.8rem, 2vw, 1.4rem);
          font-family: var(--font-body);
          font-size: 0.66rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ht-void);
          display: flex;
          align-items: center;
          overflow: hidden;
          white-space: nowrap;
        }
        .ht-brutal-strip-cell:last-child { border-right: 0; }

        .ht-brutal-strip-cell--marquee {
          color: var(--ht-red);
          mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
        }
        .ht-brutal-marquee-track {
          display: flex;
          width: max-content;
          animation: ht-brutal-marquee 18s linear infinite;
        }
        .ht-brutal-marquee-seg { display: flex; }

        @keyframes ht-brutal-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ── Scroll cue ── */
        .ht-brutal-scroll {
          position: absolute;
          right: clamp(1.5rem, 4vw, 4rem);
          bottom: clamp(3.2rem, 6.5vw, 4.5rem);
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-body);
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--ht-void);
          text-decoration: none;
          z-index: 2;
        }
        .ht-brutal-scroll-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--ht-red);
          animation: ht-brutal-bounce 1.6s ease-in-out infinite;
        }
        @keyframes ht-brutal-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }

        /* ── Mobile ── */
        @media (max-width: 860px) {
          .ht-brutal { padding-bottom: 7.5rem; }
          .ht-brutal-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .ht-brutal-collage {
            height: 280px;
            order: -1;
          }
          .ht-brutal-block--jp { width: 130px; height: 130px; font-size: 2.4rem; right: 4%; }
          .ht-brutal-block--dark { width: 160px; right: 4%; bottom: 2%; }
          .ht-brutal-badge { left: 4%; bottom: 8%; }
          .ht-brutal-strip { grid-template-columns: 1.4fr 1fr; }
          .ht-brutal-strip-cell:nth-child(3),
          .ht-brutal-strip-cell:nth-child(4) { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ht-brutal-marquee-track { animation: none; }
          .ht-brutal-scroll-dot { animation: none; }
        }
      `}</style>
    </section>
  );
}
