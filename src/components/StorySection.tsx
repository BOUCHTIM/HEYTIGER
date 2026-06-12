'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const CHAPTERS = [
  {
    id: 1,
    num: '01',
    title: 'DAYLIGHT TIGER',
    hook: 'FAMILIES, BEER, RAMEN STEAM',
    copy: 'Warm wood, loud tables, no ceremony. This is Hey Tiger when the sun is up.',
  },
  {
    id: 2,
    num: '02',
    title: 'THE DIM',
    hook: 'LOW LIGHT, LOUDER ROOM',
    copy: 'Lights drop, sake takes over. The room leans in.',
  },
  {
    id: 3,
    num: '03',
    title: 'MIDNIGHT ROOFTOP',
    hook: 'ROAR TILL SUNRISE',
    copy: 'Rooftop wind, cocktails flowing, 47 sake labels deep.',
  },
];

const DESIGN_CUES = [
  { label: 'TIMBER & STEEL', copy: 'Warm grit, cold edge' },
  { label: 'LOW GLOW', copy: 'Shadows on the wall' },
  { label: '47 SAKE', copy: 'Cellar depth' },
];

export default function StorySection({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-10% 0px' });

  return (
    <section
      id="story"
      ref={containerRef}
      aria-label="Hey Tiger — story & design"
      style={{
        background: 'var(--clr-void)',
        borderTop: '1px solid var(--border-structural)',
        borderBottom: '1px solid var(--border-structural)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="/images/spaces/corridor.jpg"
          alt=""
          fill
          unoptimized
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'contrast(1.08) saturate(0.9) brightness(0.22)',
          }}
        />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1360px',
          margin: '0 auto',
          padding: 'clamp(56px, 7vw, 96px) clamp(18px, 4vw, 48px)',
          display: 'grid',
          gridTemplateColumns: '1.1fr 1.6fr',
          gap: 'clamp(48px, 7vw, 96px)',
        }}
      >
        {/* Left Sticky Intro */}
        <div
          style={{
            position: 'sticky',
            top: 'clamp(40px, 6vw, 80px)',
            alignSelf: 'start',
          }}
        >
          <motion.div
            initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.3, 1] }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                fontWeight: 900,
                letterSpacing: '0.48em',
                color: 'var(--clr-red-80)',
                textTransform: 'uppercase',
              }}>
                THE STORY
              </span>
              <span lang="ja" style={{
                fontFamily: 'var(--font-jp)',
                fontSize: '11px',
                letterSpacing: '0.18em',
                color: 'rgba(240,235,216,0.5)',
              }}>
                物語
              </span>
              <div style={{ height: '1px', flex: 1, background: 'rgba(240,235,216,0.15)' }} />
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.3em',
                color: 'rgba(240,235,216,0.35)',
                textTransform: 'uppercase',
              }}>
                MOTOR CITY
              </span>
            </div>

            <h2 style={{
              margin: '0 0 18px',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(40px, 5.2vw, 68px)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: 'var(--clr-cream)',
              textTransform: 'uppercase',
            }}>
              ONE ROOM,
              <span style={{ display: 'block', marginTop: '0.12em', color: '#FDBE06' }}>
                THREE MOODS.
              </span>
            </h2>

            <p style={{
              margin: '0 0 22px',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(14px, 1.15vw, 16px)',
              letterSpacing: '0.02em',
              lineHeight: 1.75,
              color: 'rgba(240,235,216,0.78)',
              maxWidth: '44ch',
            }}>
              Family by day, chaos by night. But every detail has purpose: the low glow, the grit of the bar top, the shadows on the wall — designed to feel alive.
            </p>

            <p style={{
              margin: '0',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              letterSpacing: '0.2em',
              color: 'var(--clr-red-70)',
              textTransform: 'uppercase',
            }}>
              TIMBER, STEEL, SAKE, SHADOWS.
            </p>
          </motion.div>
        </div>

        {/* Right Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Story Chapters */}
          {CHAPTERS.map((chapter, i) => (
            <motion.div
              key={chapter.id}
              initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.12 + i * 0.08,
                ease: [0.22, 1, 0.3, 1],
              }}
              style={{
                paddingBottom: i < CHAPTERS.length - 1 ? '28px' : '0',
                borderBottom: i < CHAPTERS.length - 1 ? '1px solid rgba(240,235,216,0.12)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '10px',
                  fontWeight: 900,
                  letterSpacing: '0.3em',
                  color: 'var(--clr-red-70)',
                }}>
                  {chapter.num}
                </span>
                <div style={{ height: '1px', flex: 1, background: 'rgba(240,235,216,0.12)' }} />
              </div>

              <h3 style={{
                margin: '0 0 6px',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(22px, 2.4vw, 30px)',
                lineHeight: 1,
                letterSpacing: '-0.01em',
                color: i === 0 ? '#FDBE06' : 'var(--clr-cream)',
                textTransform: 'uppercase',
              }}>
                {chapter.title}
              </h3>

              <p style={{
                margin: '0 0 8px',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                color: 'rgba(240,235,216,0.55)',
                textTransform: 'uppercase',
              }}>
                {chapter.hook}
              </p>

              <p style={{
                margin: '0',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                letterSpacing: '0.02em',
                lineHeight: 1.65,
                color: 'rgba(240,235,216,0.7)',
              }}>
                {chapter.copy}
              </p>
            </motion.div>
          ))}

          {/* Integrated Design Block */}
          <motion.div
            initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.3, 1] }}
            style={{
              padding: '22px 18px',
              border: '1px solid rgba(240,235,216,0.12)',
              background: 'rgba(18,13,20,0.5)',
            }}
          >
            <h4 style={{
              margin: '0 0 16px',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(16px, 1.8vw, 20px)',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              color: 'var(--clr-cream)',
              textTransform: 'uppercase',
            }}>
              FORM, FUNCTION, & ROAR.
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {DESIGN_CUES.map((cue, i) => (
                <div key={i}>
                  <p style={{
                    margin: '0 0 4px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 900,
                    letterSpacing: '0.22em',
                    color: 'var(--clr-red-70)',
                    textTransform: 'uppercase',
                  }}>
                    {cue.label}
                  </p>
                  <p style={{
                    margin: '0',
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    letterSpacing: '0.02em',
                    lineHeight: 1.5,
                    color: 'rgba(240,235,216,0.6)',
                  }}>
                    {cue.copy}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Overrides — scoped to #story to avoid bleeding into other sections */}
      <style>{`
        @media (max-width: 1024px) {
          #story > div { grid-template-columns: 1fr !important; }
          #story > div > div:first-child {
            position: static !important;
          }
        }
        @media (max-width: 640px) {
          #story > div > div:nth-child(2) > div:last-child > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
