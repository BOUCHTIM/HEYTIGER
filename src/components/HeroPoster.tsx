'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface Props {
  onReserve: () => void;
}

const CINEMA_SEEN_KEY = 'ht-hero-cinema-seen';

const LINE_1 = ['FAMILY', 'BY', 'DAY.'];
const LINE_2 = ['CHAOS', 'BY', 'NIGHT.'];

/** Washi-paper micro texture for the cream card — inline SVG, ≤1KB. */
const WASHI_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23w)' opacity='0.5'/%3E%3C/svg%3E\")";

/** Fine grain — inline SVG, ≤2KB. */
const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch' result='n'/%3E%3CfeColorMatrix in='n' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")";

const EYEBROW_TEXT = '· · · ヘイ・タイガー — モーターシティ・ドバイ · · ·';

function isOpenNowDubai(): boolean {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Asia/Dubai' }).format(new Date())
  );
  return hour >= 12 || hour < 2;
}

function StatusDot({ open, size = 8 }: { open: boolean | null; size?: number }) {
  return (
    <span className="ht-poster-status-dot-wrap" style={{ width: size, height: size }}>
      <span
        className={`ht-poster-status-dot ${open === null ? 'is-pending' : open ? 'is-open' : 'is-closed'}`}
        style={{ width: size, height: size }}
      />
      {open && <span className="ht-poster-status-ping" style={{ width: size, height: size }} aria-hidden="true" />}
    </span>
  );
}

/**
 * HeroPoster — landing hero.
 *
 * Izakaya-poster: gradient-lit red field, ghost kanji bleeds (虎 / 夜), framed
 * photo with Ken Burns + draw-on border + live open-status, cream card welded
 * to the frame with washi texture, word-flip headline, and a tiger-mascot
 * sticker slapped on the corner. One ~1.5s load cinema, replayed only once
 * per session.
 */
export default function HeroPoster({ onReserve }: Props) {
  const reduceMotion = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

  const ghostY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 80]);
  const photoY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -40]);

  const [skipCinema, setSkipCinema] = useState(true);
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [typeProgress, setTypeProgress] = useState(1);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem(CINEMA_SEEN_KEY) === '1';
      setSkipCinema(seen);
      if (!seen) sessionStorage.setItem(CINEMA_SEEN_KEY, '1');
    } catch {
      setSkipCinema(false);
    }
  }, []);

  useEffect(() => {
    const tick = () => setIsOpen(isOpenNowDubai());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const playCinema = !reduceMotion && !skipCinema;

  useEffect(() => {
    if (!playCinema) {
      setTypeProgress(1);
      return;
    }
    setTypeProgress(0);
    const total = EYEBROW_TEXT.length;
    let i = 0;
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setTypeProgress(i / total);
        if (i >= total) clearInterval(id);
      }, 30);
    }, 900);
    return () => clearTimeout(start);
  }, [playCinema]);

  const cubic = [0.22, 1, 0.36, 1] as const;
  const delay = (ms: number) => (playCinema ? ms / 1000 : 0);

  return (
    <LazyMotion features={domAnimation}>
      <section ref={sectionRef} id="hero" aria-label="Hey Tiger — Hero" className="ht-poster">
        {/* ── Load wipe — one continuous brush stroke ───────────────── */}
        {playCinema && (
          <m.div
            className="ht-poster-wipe"
            aria-hidden="true"
            initial={{ x: '-100%' }}
            animate={{ x: ['-100%', '0%', '100%'] }}
            transition={{ duration: 0.56, times: [0, 0.5, 1], ease: cubic }}
          />
        )}

        <div className="ht-poster-frame">
          {/* grain — whole hero, one analog layer */}
          <div className="ht-poster-grain" aria-hidden="true" />

          {/* ghost kanji — top-left bleed, breathing */}
          <m.div
            className="ht-poster-kanji-tl"
            style={{ y: ghostY }}
            initial={playCinema ? { opacity: 0, scale: 1.1 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: delay(350) }}
          >
            <span className="ht-poster-kanji-glyph ht-poster-kanji-glyph--tl" aria-hidden="true" lang="ja">虎</span>
          </m.div>

          {/* second kanji — bottom-right bleed, answers "night" */}
          <div className="ht-poster-kanji-br" aria-hidden="true">
            <span className="ht-poster-kanji-glyph ht-poster-kanji-glyph--br" lang="ja">夜</span>
          </div>

          {/* vertical lore text — fills the dead red space beside the photo */}
          <span className="ht-poster-lore" aria-hidden="true">
            RAAAAAAR CULTURE · 虎 · MOTOR CITY DUBAI
          </span>

          {/* framed photo */}
          <m.div
            className="ht-poster-photo"
            style={{ y: photoY }}
            initial={playCinema ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: delay(600) }}
          >
            <Image
              src="/images/HERO.png"
              alt="Hey Tiger table — branded coasters, sake and wine"
              fill
              unoptimized
              priority
              sizes="(max-width: 860px) 92vw, 56vw"
              className="ht-poster-img"
              style={{ objectFit: 'cover' }}
            />

            {/* draw-on border, clockwise */}
            <span className="ht-poster-frame-draw ht-poster-frame-draw--top" />
            <span className="ht-poster-frame-draw ht-poster-frame-draw--right" />
            <span className="ht-poster-frame-draw ht-poster-frame-draw--bottom" />
            <span className="ht-poster-frame-draw ht-poster-frame-draw--left" />

            <m.span
              className="ht-poster-rim-label"
              lang="ja"
              initial={playCinema ? { opacity: 0, x: -20 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: delay(700) }}
            >
              ヘイ・タイガー<span className="ht-poster-cursor" aria-hidden="true">_</span>
            </m.span>

            <m.div
              className="ht-poster-callout"
              initial={playCinema ? { opacity: 0, y: -10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: delay(800) }}
            >
              <span className="ht-poster-callout-arrow" aria-hidden="true">↑</span>
              <span lang="ja" className="ht-poster-callout-text" aria-hidden="true">
                本日も営業中
              </span>
              <StatusDot open={isOpen} size={9} />
              <span className="sr-only">
                {isOpen === null ? 'Checking opening hours' : isOpen ? 'Open now — until 2AM' : 'Currently closed — opens 12PM'}
              </span>
            </m.div>

            {/* tiger sticker — slapped on the corner, last to land */}
            <m.div
              className="ht-poster-sticker"
              initial={playCinema ? { opacity: 0, scale: 0, rotate: -8 } : false}
              animate={{ opacity: 1, scale: [0, 1.1, 1], rotate: -8 }}
              whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: -12 }}
              transition={{
                opacity: { duration: 0.3, delay: delay(1400) },
                scale: { duration: 0.5, delay: delay(1400), times: [0, 0.6, 1] },
                rotate: { type: 'spring', stiffness: 300, damping: 20 },
              }}
            >
              <Image src="/tiger-mascot.png" alt="" width={96} height={96} unoptimized />
            </m.div>
          </m.div>

          {/* price / CTA band */}
          <div className="ht-poster-band">
            <span className="ht-poster-stamp ht-poster-stamp--left" aria-hidden="true">
              <Image src="/heytiger-logo.png" alt="" width={120} height={112} unoptimized style={{ width: '100%', height: 'auto' }} />
            </span>

            <div className="ht-poster-band-copy">
              <p className="ht-poster-eyebrow">
                <span className="ht-poster-eyebrow-text" lang="ja" style={{ clipPath: `inset(0 ${(1 - typeProgress) * 100}% 0 0)` }}>
                  {EYEBROW_TEXT}
                </span>
              </p>

              <h1 className="ht-poster-headline">
                <span className="ht-poster-line">
                  {LINE_1.map((word, i) => (
                    <span className="ht-poster-word-mask" key={word}>
                      <m.span
                        className="ht-poster-word"
                        initial={playCinema ? { y: '100%', opacity: 0 } : false}
                        animate={{ y: '0%', opacity: 1 }}
                        transition={{ duration: 0.6, delay: delay(1050 + i * 80), ease: cubic }}
                      >
                        {word}
                      </m.span>
                      {' '}
                    </span>
                  ))}
                </span>
                <br />
                <span className="ht-poster-line ht-poster-line--accent">
                  {LINE_2.map((word, i) => (
                    <span className="ht-poster-word-mask" key={word}>
                      <m.span
                        className="ht-poster-word ht-poster-word--neon"
                        initial={playCinema ? { y: '100%', opacity: 0 } : false}
                        animate={{ y: '0%', opacity: 1 }}
                        transition={{ duration: 0.6, delay: delay(1050 + (LINE_1.length + i) * 80), ease: cubic }}
                      >
                        {word}
                      </m.span>
                      {' '}
                    </span>
                  ))}
                </span>
              </h1>

              <m.div
                className="ht-poster-ctas"
                initial={playCinema ? { opacity: 0, y: 24 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: delay(1250), ease: 'easeOut' }}
              >
                <button type="button" onClick={onReserve} className="ht-poster-cta">
                  <StatusDot open={isOpen} />
                  BOOK A TABLE <span className="ht-poster-cta-arrow" aria-hidden="true">→</span>
                </button>
                <Link href="/menu" className="ht-poster-link">
                  VIEW MENU
                </Link>
              </m.div>
            </div>

            <span className="ht-poster-stamp ht-poster-stamp--right" aria-hidden="true">
              <span className="ht-poster-stamp-vertical">EST. 2024 · MOTOR CITY</span>
            </span>
          </div>
        </div>

        {/* scroll cue */}
        <m.div
          className="ht-poster-scroll-cue"
          initial={playCinema ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: delay(1500) }}
        >
          <span className="ht-poster-scroll-line" aria-hidden="true" />
          <span className="ht-poster-scroll-label">SCROLL</span>
        </m.div>

        <style>{`
          .ht-poster {
            --red: var(--clr-red);
            --red-deep: var(--clr-red-dim);
            --red-hot: color-mix(in srgb, var(--clr-red) 65%, white 35%);
            --cream: var(--clr-cream);
            --void: var(--clr-void);
            --open-green: #4ADE80;

            position: relative;
            width: 100%;
            min-height: 100dvh;
            background: radial-gradient(ellipse 80% 60% at 40% 30%, var(--red-hot) 0%, var(--red) 40%, var(--red-deep) 100%);
            color: var(--cream);
            padding: clamp(10px, 1.6vw, 22px);
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          /* ── Load wipe ── */
          .ht-poster-wipe {
            position: absolute;
            inset: 0;
            z-index: 30;
            background: var(--red);
            pointer-events: none;
          }

          /* ── Grain — whole hero ── */
          .ht-poster-grain {
            position: absolute;
            inset: 0;
            z-index: 20;
            pointer-events: none;
            opacity: 0.04;
            mix-blend-mode: overlay;
            background-image: ${GRAIN_SVG};
            background-size: 180px 180px;
          }

          .ht-poster-frame {
            position: relative;
            flex: 1;
            display: flex;
            flex-direction: column;
            border: 3px solid var(--cream);
            outline: 1px solid var(--cream);
            outline-offset: 8px;
            overflow: hidden;
          }

          /* ── Ghost kanji — top-left ── */
          .ht-poster-kanji-tl {
            position: absolute;
            top: -14%;
            left: -6%;
            z-index: 0;
            pointer-events: none;
          }
          .ht-poster-kanji-glyph {
            display: block;
            font-family: var(--font-japanese-serif, 'Noto Serif JP', serif);
            line-height: 0.8;
            color: var(--cream);
            user-select: none;
          }
          .ht-poster-kanji-glyph--tl {
            font-size: clamp(18rem, 50vw, 44rem);
            font-weight: 900;
            opacity: 0.92;
            animation: ht-kanji-breathe 16s ease-in-out infinite;
          }

          /* ── Ghost kanji — bottom-right, answers "night" ── */
          .ht-poster-kanji-br {
            position: absolute;
            bottom: -8%;
            right: -5%;
            z-index: 0;
            pointer-events: none;
            transform: rotate(12deg);
          }
          .ht-poster-kanji-glyph--br {
            font-size: 28vw;
            font-weight: 900;
            color: var(--void);
            opacity: 0.07;
            animation: ht-kanji-breathe 16s ease-in-out infinite;
            animation-delay: -8s;
          }

          @keyframes ht-kanji-breathe {
            0%, 100% { transform: scale(1); }
            50%      { transform: scale(1.015); }
          }

          /* ── Vertical lore text — fills dead red space ── */
          .ht-poster-lore {
            position: absolute;
            top: 50%;
            right: clamp(0.4rem, 1.6vw, 1.1rem);
            transform: translateY(-50%) rotate(180deg);
            writing-mode: vertical-rl;
            font-family: var(--font-body);
            font-size: 9px;
            letter-spacing: 0.4em;
            color: rgba(240, 235, 216, 0.25);
            z-index: 1;
            pointer-events: none;
            white-space: nowrap;
          }

          /* ── Framed photo ── */
          .ht-poster-photo {
            position: relative;
            z-index: 1;
            flex: 1;
            margin: clamp(2.5rem, 6vw, 4.5rem) clamp(1.5rem, 8vw, 8rem) 0;
            border: 4px solid var(--void);
            box-shadow: 10px 10px 0 rgba(13, 11, 10, 0.35);
            overflow: hidden;
            min-height: clamp(240px, 46vw, 480px);
          }
          .ht-poster-photo::after {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 3;
            pointer-events: none;
            background: radial-gradient(ellipse at center, transparent 50%, rgba(13, 12, 10, 0.45) 100%);
          }

          .ht-poster-img {
            animation: ht-ken-burns 14s ease-in-out infinite alternate;
            will-change: transform;
          }
          @keyframes ht-ken-burns {
            0%   { transform: scale(1)     translate(0, 0); }
            100% { transform: scale(1.06)  translate(-1.5%, -1%); }
          }

          /* draw-on border, clockwise */
          .ht-poster-frame-draw {
            position: absolute;
            z-index: 2;
            background: var(--cream);
            pointer-events: none;
          }
          .ht-poster-frame-draw--top {
            top: 0; left: 0; right: 0; height: 3px;
            transform: scaleX(0); transform-origin: left;
            animation: ht-draw-x 0.3s ease-out 0.5s forwards;
          }
          .ht-poster-frame-draw--right {
            top: 0; right: 0; bottom: 0; width: 3px;
            transform: scaleY(0); transform-origin: top;
            animation: ht-draw-y 0.3s ease-out 0.65s forwards;
          }
          .ht-poster-frame-draw--bottom {
            bottom: 0; left: 0; right: 0; height: 3px;
            transform: scaleX(0); transform-origin: right;
            animation: ht-draw-x 0.3s ease-out 0.8s forwards;
          }
          .ht-poster-frame-draw--left {
            top: 0; left: 0; bottom: 0; width: 3px;
            transform: scaleY(0); transform-origin: bottom;
            animation: ht-draw-y 0.3s ease-out 0.95s forwards;
          }
          @keyframes ht-draw-x { to { transform: scaleX(1); } }
          @keyframes ht-draw-y { to { transform: scaleY(1); } }

          .ht-poster-rim-label {
            position: absolute;
            top: clamp(0.8rem, 2vw, 1.4rem);
            left: clamp(0.8rem, 2vw, 1.4rem);
            z-index: 4;
            background: var(--void);
            color: var(--cream);
            border: 1px solid var(--cream);
            padding: 0.45rem 0.9rem;
            font-family: var(--font-jp-rough, 'Dela Gothic One', sans-serif);
            font-size: clamp(0.78rem, 1.6vw, 1.05rem);
            letter-spacing: 0.08em;
            line-height: 1;
          }
          .ht-poster-cursor {
            animation: ht-blink 1.2s step-end infinite;
          }
          @keyframes ht-blink { 50% { opacity: 0; } }

          .ht-poster-callout {
            position: absolute;
            top: clamp(0.6rem, 2vw, 1.2rem);
            right: clamp(1.2rem, 3vw, 2.4rem);
            z-index: 4;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.35rem;
            color: var(--cream);
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

          /* ── Status dot (shared: callout + booking CTA) ── */
          .ht-poster-status-dot-wrap {
            position: relative;
            display: inline-flex;
            flex-shrink: 0;
          }
          .ht-poster-status-dot {
            display: block;
            border-radius: 50%;
          }
          .ht-poster-status-dot.is-open    { background: var(--open-green); }
          .ht-poster-status-dot.is-closed  { background: var(--red); }
          .ht-poster-status-dot.is-pending { background: rgba(240, 235, 216, 0.3); }
          .ht-poster-status-ping {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: var(--open-green);
            animation: ht-status-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          @keyframes ht-status-ping {
            75%, 100% { transform: scale(2.4); opacity: 0; }
          }

          /* ── Tiger sticker ── */
          .ht-poster-sticker {
            position: absolute;
            z-index: 4;
            right: -6%;
            bottom: -8%;
            width: clamp(64px, 9vw, 110px);
            filter: drop-shadow(3px 4px 8px rgba(0, 0, 0, 0.5));
            cursor: default;
          }
          .ht-poster-sticker img { width: 100%; height: auto; display: block; }

          /* ── Price / CTA band ── */
          .ht-poster-band {
            position: relative;
            z-index: 2;
            display: grid;
            grid-template-columns: auto 1fr auto;
            align-items: center;
            gap: clamp(1rem, 3vw, 2.5rem);
            margin: -16px clamp(1.5rem, 8vw, 8rem) clamp(1.5rem, 4vw, 3rem);
            padding: clamp(1rem, 2vw, 1.6rem) clamp(1.2rem, 2.5vw, 2rem);
            background-color: var(--cream);
            background-image: ${WASHI_SVG};
            background-size: 180px 180px;
            background-blend-mode: multiply;
            color: var(--void);
            border: 3px solid var(--void);
            border-top: 2px solid var(--red);
            box-shadow: -6px 10px 30px rgba(13, 12, 10, 0.18);
          }
          .ht-poster-band::before {
            content: '';
            position: absolute;
            top: -3px;
            left: 0;
            right: 0;
            height: 1px;
            background: var(--void);
          }

          .ht-poster-stamp {
            display: flex;
            align-items: center;
            justify-content: center;
            width: clamp(56px, 7vw, 96px);
            height: clamp(56px, 7vw, 96px);
            border: 2px solid var(--void);
            padding: 0.4rem;
            background: var(--red);
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }
          .ht-poster-stamp--left {
            width: clamp(45px, 5.6vw, 77px);
            height: clamp(45px, 5.6vw, 77px);
          }
          .ht-poster-band:hover .ht-poster-stamp {
            transform: rotate(-4deg);
            box-shadow: 4px 4px 0 var(--void);
          }
          .ht-poster-stamp-vertical {
            writing-mode: vertical-rl;
            transform: rotate(180deg);
            font-family: var(--font-body);
            font-size: 9px;
            letter-spacing: 0.3em;
            color: rgba(240, 235, 216, 0.4);
            text-align: center;
            white-space: nowrap;
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
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: var(--red);
            opacity: 0.7;
            white-space: nowrap;
          }
          .ht-poster-eyebrow-text {
            display: inline-block;
          }

          .ht-poster-headline {
            margin: 0;
            font-family: var(--font-display);
            font-weight: 900;
            font-size: clamp(1.5rem, 4.6vw, 3.2rem);
            line-height: 1.05;
            letter-spacing: -0.01em;
            text-transform: uppercase;
            color: var(--void);
            text-shadow: 2px 3px 0 color-mix(in srgb, var(--red-deep) 30%, transparent);
          }
          .ht-poster-line { display: inline-block; }
          .ht-poster-word-mask {
            display: inline-block;
            overflow: hidden;
            vertical-align: top;
          }
          .ht-poster-word { display: inline-block; }
          .ht-poster-line--accent .ht-poster-word--neon {
            color: var(--red);
            animation: ht-neon-flicker 4s ease-in-out infinite;
          }
          @keyframes ht-neon-flicker {
            0%, 95%, 100% { opacity: 1; }
            96% { opacity: 0.85; }
            97% { opacity: 1; }
            98% { opacity: 0.9; }
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
            background: var(--red);
            color: var(--cream);
            border: 1px solid var(--red);
            border-radius: 0;
            padding: 0.85rem 1.8rem;
            min-height: 44px;
            cursor: pointer;
            font-family: var(--font-body);
            font-size: 0.74rem;
            font-weight: 900;
            letter-spacing: 0.26em;
            text-transform: uppercase;
            transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
          }
          .ht-poster-cta-arrow {
            display: inline-block;
            transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .ht-poster-cta:hover,
          .ht-poster-cta:focus-visible {
            background: var(--cream);
            color: var(--red);
          }
          .ht-poster-cta:hover .ht-poster-cta-arrow,
          .ht-poster-cta:focus-visible .ht-poster-cta-arrow {
            transform: translateX(6px);
          }
          .ht-poster-cta:focus-visible {
            outline: 2px solid var(--void);
            outline-offset: 2px;
          }

          .ht-poster-link {
            position: relative;
            display: inline-flex;
            align-items: center;
            min-height: 44px;
            padding: 0.85rem 1.8rem;
            border: 1px solid var(--void);
            font-family: var(--font-body);
            font-size: 0.74rem;
            font-weight: 800;
            letter-spacing: 0.26em;
            text-transform: uppercase;
            color: var(--void);
            text-decoration: none;
            transition: color 0.2s ease, border-color 0.2s ease;
          }
          .ht-poster-link::after {
            content: '';
            position: absolute;
            left: 1.8rem;
            right: 1.8rem;
            bottom: 0.7rem;
            height: 1px;
            background: var(--red);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.2s ease;
          }
          .ht-poster-link:hover,
          .ht-poster-link:focus-visible {
            color: var(--red);
            border-color: var(--red);
          }
          .ht-poster-link:hover::after,
          .ht-poster-link:focus-visible::after {
            transform: scaleX(1);
          }
          .ht-poster-link:focus-visible {
            outline: 2px solid var(--void);
            outline-offset: 2px;
          }

          /* ── Scroll cue ── */
          .ht-poster-scroll-cue {
            position: absolute;
            bottom: clamp(0.6rem, 1.6vw, 1.2rem);
            left: 50%;
            transform: translateX(-50%);
            z-index: 21;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            pointer-events: none;
          }
          .ht-poster-scroll-line {
            display: block;
            width: 1px;
            height: 28px;
            background: rgba(240, 235, 216, 0.4);
          }
          .ht-poster-scroll-label {
            font-family: var(--font-body);
            font-size: 8px;
            letter-spacing: 0.3em;
            color: rgba(240, 235, 216, 0.4);
          }

          /* ── Mobile ── */
          @media (max-width: 760px) {
            .ht-poster-photo { margin: clamp(3.5rem, 14vw, 5rem) 0.6rem 0; }
            .ht-poster-kanji-glyph--tl { font-size: 14rem; }
            .ht-poster-kanji-tl { top: -8%; left: -10%; }
            .ht-poster-kanji-glyph--br { font-size: 40vw; opacity: 0.05; }
            .ht-poster-lore { display: none; }
            .ht-poster-band {
              grid-template-columns: 1fr;
              margin: -16px 0.6rem 1.2rem;
              text-align: center;
            }
            .ht-poster-stamp { display: none; }
            .ht-poster-ctas { flex-direction: column; align-items: stretch; }
            .ht-poster-cta, .ht-poster-link { justify-content: center; }
            .ht-poster-sticker { width: clamp(48px, 16vw, 70px); right: -3%; bottom: -4%; }
          }
          @media (max-width: 360px) {
            .ht-poster-kanji-glyph--br { display: none; }
          }

          /* ── Reduced motion ── */
          @media (prefers-reduced-motion: reduce) {
            .ht-poster-wipe { display: none; }
            .ht-poster-img { animation: none; }
            .ht-poster-kanji-glyph--tl,
            .ht-poster-kanji-glyph--br { animation: none; }
            .ht-poster-word--neon { animation: none; }
            .ht-poster-cursor { animation: none; opacity: 1; }
            .ht-poster-status-ping { animation: none; display: none; }
            .ht-poster-frame-draw {
              transform: none !important;
              animation: none !important;
            }
            .ht-poster-sticker { transition: none; }
          }
        `}</style>
      </section>
    </LazyMotion>
  );
}
