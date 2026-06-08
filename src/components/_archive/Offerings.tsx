// ARCHIVED — possibly used on secondary pages.
// Confirm usage before restoring. Do not import from active components.
// Archived: 2026-05-31
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.15 } },
};

/* ─── DAY ──────────────────────────────────────────────────────────── */
export function DayOffering() {
  const ref     = useRef<HTMLElement>(null);
  const inView  = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <section
      id="about"
      ref={ref}
      aria-label="By Day — your sanctuary"
      style={{
        backgroundColor: 'var(--clr-cream)',
        color: 'var(--clr-void)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '620px',
      }}
      className="offering-grid"
      >
        {/* Text */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          style={{
            padding: 'clamp(56px, 8vw, 112px) clamp(48px, 7vw, 96px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '24px',
            backgroundColor: '#317f82',
            backgroundImage: 'var(--ht-texture-washi)',
            color: 'var(--clr-void)',
          }}
        >
          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.4))' }} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '0.44em',
              color: 'rgba(100,72,28,0.8)',
              fontWeight: 700,
            }}>BY DAY</span>
          </motion.div>

          <motion.h2 variants={fadeUp} style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(44px, 6vw, 88px)',
            lineHeight: 0.96,
            color: '#e4e9c3',
            letterSpacing: '-0.03em',
          }}>
            Your<br />Sanctuary.
          </motion.h2>

          <motion.div variants={fadeUp} style={{
            width: '36px', height: '1px',
            background: 'rgba(201,162,39,0.6)',
          }} />

          <motion.p variants={fadeUp} style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(17px, 1.8vw, 22px)',
            lineHeight: 1.75,
            color: '#000000',
            maxWidth: '44ch',
          }}>
            Cozy. Laid-back. Family haven.<br /><br />
            Mom sips wine. Dad dives into ramen. Everyone&apos;s at ease.
            We&apos;re not a restaurant — we&apos;re your neighborhood anchor.
            A place where your Sunday feels like home.
          </motion.p>

          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px', maxWidth: '44ch' }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              letterSpacing: '0.2em',
              fontWeight: 600,
              backgroundColor: '#e4eec7',
              color: '#357a7c',
              border: '1px solid rgba(21,13,17,0.25)',
              padding: '5px 12px',
              borderRadius: '20px',
            }}>COZY</span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              letterSpacing: '0.2em',
              fontWeight: 600,
              backgroundColor: '#f3f3c3',
              color: '#31787b',
              border: '1px solid rgba(21,13,17,0.25)',
              padding: '5px 12px',
              borderRadius: '20px',
            }}>CASUAL</span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              letterSpacing: '0.2em',
              fontWeight: 600,
              backgroundColor: '#d1dfbd',
              color: '#387f81',
              border: '1px solid rgba(21,13,17,0.25)',
              padding: '5px 12px',
              borderRadius: '20px',
            }}>FAMILY-FRIENDLY</span>
          </motion.div>
        </motion.div>

        {/* Image panel */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: 'relative',
            overflow: 'hidden',
            minHeight: '500px',
          }}
        >
          <DayScene />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .offering-grid { grid-template-columns: 1fr !important; }
          .offering-grid > *:last-child { min-height: 320px !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── EVENING ───────────────────────────────────────────────────────── */
export function EveningOffering() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <section
      id="experience"
      ref={ref}
      aria-label="By Evening — clock-out hour"
      style={{
        backgroundColor: 'var(--clr-void)',
        color: 'var(--clr-cream)',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(232,52,26,0.18)',
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '620px',
      }}
      className="offering-grid"
      >
        {/* Image panel — left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ position: 'relative', overflow: 'hidden', minHeight: '500px' }}
          className="offering-img-eve"
        >
          <EveningScene />
        </motion.div>

        {/* Text — right */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          style={{
            padding: 'clamp(56px, 8vw, 112px) clamp(48px, 7vw, 96px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '24px',
            backgroundColor: '#2f797b',
            height: '100%',
          }}
        >
          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(44,74,62,0.5))' }} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '0.44em',
              color: 'rgba(44,74,62,0.8)',
              fontWeight: 700,
            }}>BY EVENING</span>
          </motion.div>

          <motion.h2 variants={fadeUp} style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(40px, 5.5vw, 80px)',
            lineHeight: 0.96,
            letterSpacing: '-0.03em',
            color: '#d1dfbd',
          }}>
            Clock-Out<br />
            <span style={{ color: '#c9d7b6' }}>O&apos;Clock.</span>
          </motion.h2>

          <motion.div variants={fadeUp} style={{
            width: '36px', height: '1px',
            backgroundColor: 'rgba(232,52,26,0.6)',
          }} />

          <motion.p variants={fadeUp} style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(17px, 1.8vw, 22px)',
            lineHeight: 1.75,
            color: '#000000',
            maxWidth: '44ch',
          }}>
            The white-collar crew rolls in.<br /><br />
            Stress swaps for beer. That one co-worker gets vented about.
            Friends kick back. The bar becomes your third place.
            Japanese craft cocktails. Late-night sushi. A vibe that gets it.
          </motion.p>

          <motion.div variants={fadeUp} style={{ marginTop: '2px' }}>
            <a href="#book" style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              fontWeight: 800,
              letterSpacing: '0.18em',
              color: '#0D0D0D',
              backgroundColor: '#cad8b7',
              padding: '16px 36px',
              borderRadius: '40px',
              textDecoration: 'none',
              transition: 'background 0.25s, transform 0.2s, box-shadow 0.25s',
              boxShadow: '0 6px 24px rgba(250,175,63,0.42)',
              minHeight: '48px',
              animation: 'ht-cta-pulse 3s ease-in-out infinite',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#d7e4c6'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(250,175,63,0.6)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#cad8b7'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(250,175,63,0.42)'; }}
            >
              TAKE A SEAT →
            </a>
          </motion.div>

          <motion.div variants={fadeUp} style={{ marginTop: 'auto' }}>
            <span style={{
              fontFamily: 'var(--font-jp)',
              fontSize: '14px',
              letterSpacing: '0.2em',
              color: '#000000',
            }}>
              Est. 1972 — THE WEST MEETS THE EAST
            </span>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .offering-img-eve { order: -1; }
        }
      `}</style>
    </section>
  );
}

export function NightOffering() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <section
      id="events"
      ref={ref}
      aria-label="By Night"
      style={{
        backgroundColor: 'var(--clr-void)',
        color: 'var(--clr-cream)',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(232,52,26,0.18)',
      }}
    >
      <div
        style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', minHeight: '680px' }}
        className="offering-grid night-grid"
      >
        {/* Large night scene — left */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ position: 'relative', overflow: 'hidden', minHeight: '500px' }}
        >
          <NightScene />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, transparent 55%, var(--clr-void) 100%)',
            pointerEvents: 'none',
          }} />
        </motion.div>

        {/* Content panel — right */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          style={{
            padding: 'clamp(48px, 6vw, 80px) clamp(40px, 5vw, 64px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '20px',
            backgroundColor: 'var(--clr-void)',
            backgroundImage: 'var(--ht-texture-sumi)',
          }}
        >
          <motion.span variants={fadeUp} style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            letterSpacing: '0.36em',
            color: 'var(--clr-red)',
            fontWeight: 700,
          }}>
            DJ · COCKTAILS · LATE-NIGHT
          </motion.span>

          <motion.h2 variants={fadeUp} style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(52px, 5.5vw, 86px)',
            lineHeight: 0.92,
            letterSpacing: '-0.02em',
            color: 'var(--clr-cream)',
            margin: 0,
          }}>
            BY NIGHT
          </motion.h2>

          <motion.p variants={fadeUp} style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(14px, 1.4vw, 17px)',
            lineHeight: 1.75,
            color: 'rgba(245,239,224,0.68)',
            maxWidth: '360px',
            margin: 0,
          }}>
            The lights drop. The music rises. Hey Tiger sheds its day skin — raw, electric, built around you.
          </motion.p>

          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--clr-red)', flexShrink: 0,
              boxShadow: '0 0 8px rgba(232,52,26,0.7)',
            }} />
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '11px',
              letterSpacing: '0.3em', fontWeight: 700,
              color: 'rgba(245,239,224,0.45)',
            }}>
              NIGHT RITUALS
            </span>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '11px',
              letterSpacing: '0.2em', fontWeight: 700,
              color: 'var(--clr-amber)',
            }}>
              21:00 → 04:00
            </span>
          </motion.div>

          <motion.div variants={stagger} style={{
            display: 'flex', flexDirection: 'column',
            borderTop: '1px solid rgba(232,52,26,0.2)',
            paddingTop: '20px',
          }}>
            {[
              { name: 'LIVE DJ SETS',       detail: 'Curated beats from dusk to 2AM.' },
              { name: 'CRAFT COCKTAILS',    detail: 'Japanese-inspired signature pours.' },
              { name: 'LATE-NIGHT SUSHI',   detail: 'Kitchen open until last call.' },
            ].map(({ name, detail }) => (
              <motion.div key={name} variants={fadeUp} style={{
                display: 'flex', gap: '14px', padding: '13px 0',
                borderBottom: '1px solid rgba(245,239,224,0.07)',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'rgba(232,52,26,0.6)', flexShrink: 0, marginTop: '7px',
                }} />
                <div>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: '12px',
                    fontWeight: 800, letterSpacing: '0.22em',
                    color: 'var(--clr-cream)', marginBottom: '3px',
                  }}>{name}</div>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: '13px',
                    letterSpacing: '0.04em', color: 'rgba(245,239,224,0.42)',
                  }}>{detail}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp}>
            <a
              href="#book"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontFamily: 'var(--font-body)', fontSize: '14px',
                fontWeight: 800, letterSpacing: '0.18em',
                color: 'var(--clr-cream)', background: 'var(--clr-red)',
                padding: '15px 32px', borderRadius: '40px',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(232,52,26,0.35)',
                minHeight: '44px',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(232,52,26,0.55)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,52,26,0.35)'; }}
            >
              CLAIM THE NIGHT →
            </a>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .night-grid { grid-template-columns: 1fr !important; }
          .night-grid > *:first-child { min-height: 320px !important; }
        }
      `}</style>
    </section>
  );
}

/* ── Illustrated scene placeholders (SVG art) ───────────────────────── */

function DayScene() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Image
        src="/images/sanctuary/your-sanctuary.jpeg"
        alt=""
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}

function EveningScene() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Image
        src="/images/experience/rooftop.jpeg"
        alt=""
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: 'cover', filter: 'contrast(1.05) saturate(1.12) brightness(1.08)' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(114,62,32,0.14)', mixBlendMode: 'multiply' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(42,32,37,0.10)', mixBlendMode: 'soft-light' }} />
    </div>
  );
}

function NightScene() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Image
        src="/images/events/night.jpeg"
        alt=""
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}
