'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGalleryAnimations } from '@/hooks/useGalleryAnimations';

/* ─── Shots ───────────────────────────────────────────────────────────
   5-beat narrative: morning → afternoon → dusk → night → after hours.
   Previously 4 shots — 4 (shi) avoided; expanded to auspicious 5. */
type Shot = { jp: string; eyebrow: string; title: string; line: string; accent: string; img: string };

const SHOTS: Shot[] = [
  {
    jp: '朝', eyebrow: 'MORNING',
    title: 'THE ROOM, BEFORE THE NOISE',
    line: 'Tables wiped, lights low, the smell of charcoal just starting to wake.',
    accent: '#C17B3F',
    img: '/images/brand/venue/p08_011_736x981.png',
  },
  {
    jp: '昼', eyebrow: 'AFTERNOON',
    title: 'FAMILY BY DAY',
    line: 'Long lunches, loud tables, the regulars already arguing over the bill.',
    accent: '#C8B890',
    img: '/images/brand/interiors/p14_039_1143x1714.png',
  },
  {
    jp: '宵', eyebrow: 'DUSK',
    title: 'THE LIGHTS DROP',
    line: 'Steel catches the gold. The first bottle of sake hits the table.',
    accent: '#CC4A2C',
    img: '/images/brand/interiors/p13_033_735x1054.png',
  },
  {
    jp: '夜', eyebrow: 'NIGHT',
    title: 'CHAOS BY NIGHT',
    line: 'Sake, smoke, and the room at full volume — this is Hey Tiger after dark.',
    accent: '#C83D20',
    img: '/images/brand/venue/p08_013_2095x2793.png',
  },
  {
    jp: '宴', eyebrow: 'AFTER HOURS',
    title: 'THE FLOOR IS YOURS',
    line: 'Last call called. No one left. This is the hour that belongs only to regulars.',
    accent: '#8B3A2C',
    // TODO: Replace with dedicated after-hours shot
    img: '/images/brand/art-direction/p12_030_736x983.png',
  },
];

export default function CinematicCamera() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useGalleryAnimations(sectionRef, wrapRefs, imgRefs, textRefs, SHOTS.length);

  return (
    <section
      ref={sectionRef}
      aria-label="A day at Hey Tiger, morning to night"
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--clr-void)',
        borderTop: '1px solid rgba(255,110,50,0.12)',
      }}
    >
      {SHOTS.map((shot, i) => (
        <div
          key={shot.title}
          ref={(el) => { wrapRefs.current[i] = el; }}
          style={{ position: 'absolute', inset: 0, willChange: 'opacity' }}
        >
          {/* Scaled wrapper — the camera "push-in" target, kept separate from
              the cross-dissolve opacity so the two transforms don't fight. */}
          <div
            ref={(el) => { imgRefs.current[i] = el; }}
            style={{ position: 'absolute', inset: 0, willChange: 'transform' }}
          >
            <Image
              src={shot.img}
              alt=""
              aria-hidden="true"
              fill
              unoptimized
              priority={i === 0}
              sizes="100vw"
              style={{ objectFit: 'cover', filter: 'brightness(0.6) contrast(1.08) saturate(0.95)' }}
            />
          </div>

          {/* Grade — anchors the caption and ties the frame to its accent colour. */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background:
                `linear-gradient(0deg, rgba(10,8,8,0.92) 0%, rgba(10,8,8,0.35) 45%, rgba(10,8,8,0.15) 100%),` +
                `radial-gradient(120% 80% at 15% 100%, color-mix(in srgb, ${shot.accent} 28%, transparent) 0%, transparent 60%)`,
            }}
          />

          <span
            lang="ja"
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: 'clamp(8px,3vw,40px)',
              bottom: 'clamp(-10px,1vw,10px)',
              fontFamily: 'var(--font-jp-rough, var(--font-jp))',
              fontSize: 'clamp(140px,22vw,360px)',
              lineHeight: 0.8,
              color: `color-mix(in srgb, ${shot.accent} 30%, transparent)`,
              pointerEvents: 'none',
              userSelect: 'none',
              mixBlendMode: 'overlay',
            }}
          >
            {shot.jp}
          </span>

          {/* Caption — bottom-left safe zone. */}
          <div
            ref={(el) => { textRefs.current[i] = el; }}
            style={{
              position: 'absolute',
              left: 'var(--space-section-x, 32px)',
              bottom: 'clamp(40px, 8vh, 96px)',
              right: 'clamp(120px, 20vw, 320px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              background: 'rgba(13,11,10,0.55)',
              padding: '1rem 1.2rem',
              backdropFilter: 'blur(2px)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(10px,1.3vw,12px)',
                fontWeight: 900,
                letterSpacing: '0.5em',
                color: shot.accent,
                textTransform: 'uppercase',
              }}
            >
              {String(i + 1).padStart(2, '0')} / {String(SHOTS.length).padStart(2, '0')} · {shot.eyebrow}
            </span>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(36px,6.5vw,96px)',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                color: '#FFF8E7',
                textTransform: 'uppercase',
              }}
            >
              {shot.title}
            </h2>
            <p
              style={{
                margin: 0,
                maxWidth: '46ch',
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(14px,1.3vw,18px)',
                lineHeight: 1.75,
                color: 'var(--clr-cream)',
              }}
            >
              {shot.line}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
