'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Props {
  onReserve: () => void;
}

/**
 * HeroPoster — landing hero.
 *
 * Izakaya-poster layout: full-bleed red field, a cream double-border frame,
 * a huge cream ghost kanji bleeding off the top edge, a framed photo with a
 * "HEY TIGER" rim label + callout arrow, and a cream price/CTA band with
 * mirrored corner logo stamps (the heytiger-logo.png mark, both corners —
 * echoes the reference poster's twin "力寿司" boxes).
 */
export default function HeroPoster({ onReserve }: Props) {
  return (
    <section id="hero" aria-label="Hey Tiger — Hero" className="ht-poster">
      <div className="ht-poster-frame">
        {/* ghost kanji — bleeds off the top/left edge */}
        <span className="ht-poster-ghost" aria-hidden="true" lang="ja">
          虎
        </span>

        {/* framed photo */}
        <div className="ht-poster-photo">
          <Image
            src="/images/HERO.png"
            alt="Hey Tiger table — branded coasters, sake and wine"
            fill
            unoptimized
            priority
            sizes="(max-width: 860px) 92vw, 56vw"
            style={{ objectFit: 'cover' }}
          />

          <span className="ht-poster-rim-label" lang="ja">
            ヘイ・タイガー
          </span>

          <span className="ht-poster-callout" aria-hidden="true">
            <span className="ht-poster-callout-arrow">↑</span>
            <span lang="ja" className="ht-poster-callout-text">
              本日も営業中!!
            </span>
          </span>
        </div>

        {/* price / CTA band */}
        <div className="ht-poster-band">
          <span className="ht-poster-stamp" aria-hidden="true">
            <Image src="/heytiger-logo.png" alt="" width={120} height={112} unoptimized style={{ width: '100%', height: 'auto' }} />
          </span>

          <div className="ht-poster-band-copy">
            <p className="ht-poster-eyebrow" lang="ja">
              ヘイ・タイガー — モーターシティ・ドバイ
            </p>
            <h1 className="ht-poster-headline">
              FAMILY BY DAY.<br />CHAOS BY NIGHT.
            </h1>
            <div className="ht-poster-ctas">
              <button type="button" onClick={onReserve} className="ht-poster-cta">
                BOOK A TABLE <span aria-hidden="true">→</span>
              </button>
              <Link href="/menu" className="ht-poster-link">
                VIEW MENU
              </Link>
            </div>
          </div>

          <span className="ht-poster-stamp" aria-hidden="true">
            <Image src="/heytiger-logo.png" alt="" width={120} height={112} unoptimized style={{ width: '100%', height: 'auto' }} />
          </span>
        </div>
      </div>

      <style>{`
        .ht-poster {
          position: relative;
          width: 100%;
          min-height: 100dvh;
          background: var(--ht-red);
          color: var(--ht-cream);
          padding: clamp(10px, 1.6vw, 22px);
          display: flex;
          overflow: hidden;
        }

        .ht-poster-frame {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          border: 3px solid var(--ht-cream);
          outline: 1px solid var(--ht-cream);
          outline-offset: 8px;
          overflow: hidden;
        }

        /* ── Ghost kanji ── */
        .ht-poster-ghost {
          position: absolute;
          top: -14%;
          left: -6%;
          font-family: var(--font-japanese-serif, 'Noto Serif JP', serif);
          font-size: clamp(18rem, 50vw, 44rem);
          font-weight: 900;
          line-height: 0.8;
          color: var(--ht-cream);
          opacity: 0.92;
          z-index: 0;
          user-select: none;
          pointer-events: none;
        }

        /* ── Framed photo ── */
        .ht-poster-photo {
          position: relative;
          z-index: 1;
          flex: 1;
          margin: clamp(2.5rem, 6vw, 4.5rem) clamp(1.5rem, 8vw, 8rem) 0;
          border: 4px solid var(--ht-void);
          box-shadow: 10px 10px 0 rgba(13, 11, 10, 0.35);
          overflow: hidden;
          min-height: clamp(240px, 46vw, 480px);
        }

        .ht-poster-rim-label {
          position: absolute;
          top: clamp(0.8rem, 2vw, 1.4rem);
          left: clamp(0.8rem, 2vw, 1.4rem);
          background: var(--ht-void);
          color: var(--ht-cream);
          border: 2px solid var(--ht-cream);
          padding: 0.45rem 0.9rem;
          font-family: var(--font-jp-rough, 'Dela Gothic One', sans-serif);
          font-size: clamp(0.78rem, 1.6vw, 1.05rem);
          letter-spacing: 0.08em;
          line-height: 1;
        }

        .ht-poster-callout {
          position: absolute;
          top: clamp(0.6rem, 2vw, 1.2rem);
          right: clamp(1.2rem, 3vw, 2.4rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          color: var(--ht-cream);
          text-shadow: 0 1px 6px rgba(13, 11, 10, 0.8);
        }
        .ht-poster-callout-arrow {
          font-size: clamp(1.4rem, 3vw, 2.2rem);
          line-height: 1;
          font-weight: 900;
        }
        .ht-poster-callout-text {
          writing-mode: vertical-rl;
          font-family: var(--font-japanese-serif, 'Noto Serif JP', serif);
          font-size: clamp(0.65rem, 1.2vw, 0.85rem);
          letter-spacing: 0.18em;
        }

        /* ── Price / CTA band ── */
        .ht-poster-band {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: clamp(1rem, 3vw, 2.5rem);
          margin: clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 8vw, 8rem) clamp(1.5rem, 4vw, 3rem);
          padding: clamp(1rem, 2vw, 1.6rem) clamp(1.2rem, 2.5vw, 2rem);
          background: var(--ht-cream);
          color: var(--ht-void);
          border: 3px solid var(--ht-void);
        }

        .ht-poster-stamp {
          display: block;
          width: clamp(56px, 7vw, 96px);
          border: 2px solid var(--ht-void);
          padding: 0.4rem;
          background: var(--ht-red);
        }

        .ht-poster-band-copy {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(0.4rem, 1vw, 0.7rem);
          text-align: center;
        }

        .ht-poster-eyebrow {
          margin: 0;
          font-family: var(--font-body);
          font-size: clamp(0.6rem, 1vw, 0.74rem);
          font-weight: 800;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--ht-red);
        }

        .ht-poster-headline {
          margin: 0;
          font-family: var(--font-display);
          font-weight: 900;
          font-size: clamp(1.5rem, 4.6vw, 3.2rem);
          line-height: 1.05;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: var(--ht-void);
        }

        .ht-poster-ctas {
          display: flex;
          align-items: center;
          gap: clamp(0.8rem, 2vw, 1.4rem);
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 0.3rem;
        }

        .ht-poster-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.6em;
          background: var(--ht-red);
          color: var(--ht-cream);
          border: 2px solid var(--ht-void);
          border-radius: 0;
          padding: 0.85rem 1.8rem;
          min-height: 44px;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.74rem;
          font-weight: 900;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        .ht-poster-cta:hover,
        .ht-poster-cta:focus-visible {
          background: var(--ht-void);
          transform: translate(-3px, -3px);
          box-shadow: 5px 5px 0 var(--ht-red);
        }

        .ht-poster-link {
          font-family: var(--font-body);
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--ht-void);
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: color 0.15s ease;
        }
        .ht-poster-link:hover,
        .ht-poster-link:focus-visible { color: var(--ht-red); }

        /* ── Mobile ── */
        @media (max-width: 760px) {
          .ht-poster-photo { margin: clamp(3.5rem, 14vw, 5rem) 0.6rem 0; }
          .ht-poster-ghost { font-size: 14rem; top: -8%; left: -10%; }
          .ht-poster-band {
            grid-template-columns: 1fr;
            margin: 1rem 0.6rem 1.2rem;
            text-align: center;
          }
          .ht-poster-stamp { display: none; }
        }
      `}</style>
    </section>
  );
}
