'use client';

import { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Panels ──────────────────────────────────────────────────────────
   Five frames of the kitchen craft. Each panel carries a moody venue photo
   behind the type; `img` + `accent` tune the background, a gradient overlay
   keeps the copy legible. */
type Panel = { num: string; jp: string; title: string; line: string; accent: string; img: string };

const PANELS: Panel[] = [
  { num: '01', jp: '火', title: 'THE FIRE',   line: 'Binchotan, lit an hour before service. Nothing touches the grill until the coals breathe white.', accent: '#C83D20', img: '/images/brand/art-direction/p11_027_1143x1715.png' },
  { num: '02', jp: '刃', title: 'THE BLADE',  line: 'One knife, one cut. The fish is broken down to order, never before — texture is a clock.',        accent: '#C17B3F', img: '/images/brand/interiors/p13_034_832x1456.png' },
  { num: '03', jp: '塩', title: 'THE SALT',   line: 'Seasoned from height, by feel, by hand. The first taste decides whether a plate leaves the pass.',   accent: '#CC4A2C', img: '/images/brand/art-direction/p10_022_1143x1715.png' },
  { num: '04', jp: '盛', title: 'THE PLATE',  line: 'Stacked, never crowded. Negative space is part of the dish — the eye eats first.',                  accent: '#B22D12', img: '/images/brand/art-direction/p12_030_736x983.png' },
  { num: '05', jp: '出', title: 'THE PASS',   line: 'Called, wiped, and gone in seconds. From flame to table while the char is still loud.',            accent: '#C8B890', img: '/images/brand/art-direction/p10_023_736x1104.png' },
];

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;

    // gsap.context scopes selectors + gives one revert() for full cleanup.
    const ctx = gsap.context(() => {
      // Sync ScrollTrigger to Lenis when smooth scroll is active (reduced-motion
      // users get no Lenis — native scroll events drive ScrollTrigger directly).
      const lenis = (window as unknown as { lenis?: { on?: (e: string, cb: () => void) => void; off?: (e: string, cb: () => void) => void } }).lenis;
      const onLenis = () => ScrollTrigger.update();
      lenis?.on?.('scroll', onLenis);

      // Desktop only: pin the section and scrub the track horizontally.
      // mm.add cleans the trigger up automatically below the breakpoint.
      const mm = gsap.matchMedia();
      mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
        // Distance is cached and recomputed in onRefresh so the pin spacer is
        // sized from the *final* laid-out track width (after fonts reflow),
        // not whatever it measured at creation.
        let distance = track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -distance,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            // Pin the inner wrapper, not the section. The section is a direct
            // flex child of <main>; ScrollTrigger's pin-spacer can't add scroll
            // length to a flex item, so we pin a block-flow element inside it.
            pin: pin,
            start: 'top top',
            end: () => `+=${distance}`,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: () => {
              distance = track.scrollWidth - window.innerWidth;
            },
          },
        });
      });

      // Fonts/late layout change the track width — refresh once they settle so
      // the pin distance reflects the real measurement.
      const refresh = () => ScrollTrigger.refresh();
      (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready.then(refresh);
      window.addEventListener('load', refresh);

      return () => {
        lenis?.off?.('scroll', onLenis);
        window.removeEventListener('load', refresh);
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="On the pass — the kitchen craft"
      style={{
        background: 'var(--clr-void)',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,110,50,0.12)',
      }}
    >
      {/* Pinned wrapper — block-flow element ScrollTrigger can size. */}
      <div ref={pinRef} className="hscroll-pin" style={{ height: '100vh', overflow: 'hidden' }}>
      <div
        ref={trackRef}
        className="hscroll-track"
        style={{
          display: 'flex',
          alignItems: 'stretch',
          // Desktop: a single 100vh row the pin scrubs. Mobile/reduced-motion:
          // the same row scrolls natively (overflow-x), no pin (see style block).
          height: '100%',
          width: 'max-content',
        }}
      >
        {/* Intro panel */}
        <article className="hscroll-panel hscroll-intro">
          <span className="hscroll-eyebrow">ON THE PASS · <span lang="ja" style={{ fontFamily: 'var(--font-jp)' }}>板場</span></span>
          <h2 className="hscroll-h2">FIVE<br />MOVES.</h2>
          <p className="hscroll-introline">Every plate is the same five decisions, made fast and made right. Scroll the line.</p>
          <span aria-hidden="true" className="hscroll-hint">DRAG · SCROLL →</span>
        </article>

        {PANELS.map((p) => (
          <article key={p.num} className="hscroll-panel hscroll-photo" style={{ '--accent': p.accent } as React.CSSProperties}>
            {/* Background photo + legibility grade */}
            <Image
              src={p.img}
              alt=""
              aria-hidden="true"
              fill
              unoptimized
              sizes="(max-width: 900px) 80vw, 560px"
              className="hscroll-img"
            />
            <span aria-hidden="true" className="hscroll-grade" />
            <span lang="ja" aria-hidden="true" className="hscroll-ghost">{p.jp}</span>
            <span className="hscroll-num">{p.num} / 05</span>
            <h3 className="hscroll-title">{p.title}</h3>
            <p className="hscroll-line">{p.line}</p>
          </article>
        ))}
      </div>
      </div>

      <style>{`
        /* Mobile + reduced-motion: native horizontal swipe, no pin. */
        @media (max-width: 900px), (prefers-reduced-motion: reduce) {
          .hscroll-pin { height: auto !important; }
          .hscroll-track {
            height: auto !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            transform: none !important;
          }
          .hscroll-panel { scroll-snap-align: start; }
        }
        .hscroll-panel {
          position: relative;
          flex: 0 0 auto;
          width: clamp(78vw, 80vw, 560px);
          height: 100%;
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 18px;
          padding: clamp(32px, 6vw, 88px);
          border-right: 1px solid rgba(255,110,50,0.12);
          overflow: hidden;
        }
        .hscroll-intro { width: clamp(78vw, 70vw, 520px); background: rgba(255,109,61,0.04); }
        .hscroll-img {
          object-fit: cover;
          z-index: 0;
          filter: brightness(0.62) contrast(1.06) saturate(0.95);
          user-select: none;
          pointer-events: none;
        }
        /* Accent-tinted darkening from the bottom — anchors the type, ties the
           photo to the panel's accent colour. */
        .hscroll-grade {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            linear-gradient(0deg, rgba(10,8,8,0.92) 0%, rgba(10,8,8,0.45) 42%, rgba(10,8,8,0.25) 100%),
            radial-gradient(120% 80% at 20% 100%, color-mix(in srgb, var(--accent) 30%, transparent) 0%, transparent 60%);
        }
        .hscroll-eyebrow {
          font-family: var(--font-body); font-size: clamp(10px,1.3vw,12px); font-weight: 900;
          letter-spacing: 0.5em; color: #FF7240; text-transform: uppercase;
        }
        .hscroll-h2 {
          margin: 0; font-family: var(--font-display); font-weight: 900;
          font-size: clamp(48px,8vw,108px); line-height: 0.88; letter-spacing: -0.04em;
          color: #FFF8E7; text-transform: uppercase;
        }
        .hscroll-introline {
          margin: 0; max-width: 32ch; font-family: var(--font-body);
          font-size: clamp(13px,1.2vw,16px); line-height: 1.7; color: rgba(240,235,216,0.7);
        }
        .hscroll-hint {
          margin-top: 8px; font-family: var(--font-body); font-size: 11px; font-weight: 800;
          letter-spacing: 0.4em; color: rgba(255,220,180,0.5); text-transform: uppercase;
        }
        .hscroll-ghost {
          position: absolute; right: clamp(8px,2vw,28px); bottom: clamp(-6px,1vw,10px);
          font-family: var(--font-jp-rough, var(--font-jp)); font-size: clamp(120px,18vw,300px);
          line-height: 0.8; color: color-mix(in srgb, var(--accent) 30%, transparent);
          pointer-events: none; user-select: none; z-index: 1; mix-blend-mode: overlay;
        }
        .hscroll-num {
          position: relative; z-index: 1; font-family: var(--font-body); font-size: 10px;
          font-weight: 900; letter-spacing: 0.42em; color: var(--accent); text-transform: uppercase;
        }
        .hscroll-title {
          position: relative; z-index: 1; margin: 0; font-family: var(--font-display);
          font-weight: 900; font-size: clamp(40px,5.5vw,84px); line-height: 0.92;
          letter-spacing: -0.03em; color: #FFF8E7; text-transform: uppercase;
          text-shadow: 0 2px 20px rgba(13,11,10,0.85), 0 0 60px rgba(13,11,10,0.6);
        }
        .hscroll-line {
          position: relative; z-index: 1; margin: 0; max-width: 30ch; font-family: var(--font-body);
          font-size: clamp(14px,1.2vw,17px); line-height: 1.75; color: rgba(240,235,216,0.74);
        }
      `}</style>
    </section>
  );
}
