// ARCHIVED — possibly used on secondary pages.
// Confirm usage before restoring. Do not import from active components.
// Archived: 2026-05-31
'use client';

import Image from 'next/image';
import SectionTitle from './SectionTitle';

const HOURS = [
  { day: 'MON',       time: 'CLOSED' },
  { day: 'TUE – FRI', time: '6PM – 2AM' },
  { day: 'SATURDAY',  time: '11AM – 2AM' },
  { day: 'SUNDAY',    time: '11AM – MIDNIGHT' },
];

export default function ContactSection({
  onReserve,
  reduceMotion,
}: {
  onReserve: () => void;
  reduceMotion: boolean;
}) {
  return (
    <section
      id="contact"
      aria-label="Visit Us"
      style={{
        background: '#C54834',
        padding: 'clamp(80px, 12vw, 160px) clamp(24px, 6vw, 96px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Ghost kanji */}
      <div aria-hidden="true" style={{
        position: 'absolute', right: '-2%', top: '-8%',
        fontFamily: 'var(--font-jp)', fontWeight: 900,
        fontSize: 'clamp(200px, 36vw, 580px)', lineHeight: 1,
        color: 'rgba(93,159,196,0.04)', userSelect: 'none', pointerEvents: 'none',
        zIndex: 0,
      }}>来</div>

      {/* Halftone cluster — bottom left */}
      <div aria-hidden="true" style={{
        position: 'absolute', left: 0, bottom: 0,
        width: '40%', height: '40%', pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'radial-gradient(circle, rgba(197,72,52,0.1) 1px, transparent 1px)',
        backgroundSize: '10px 10px',
        maskImage: 'radial-gradient(ellipse at bottom left, black 0%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse at bottom left, black 0%, transparent 70%)',
      }} />

      {/* ── Secondary art-direction strip — thin film strip above mosaic ── */}
      <div
        aria-hidden="true"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '3px',
          height: 'clamp(80px, 11vw, 140px)',
          position: 'relative', zIndex: 1,
          margin: 'calc(-1 * clamp(80px, 12vw, 160px)) calc(-1 * clamp(24px, 6vw, 96px)) 0',
          overflow: 'hidden',
        }}
      >
        {[
          { src: '/images/brand/art-direction/p16_047_736x1041.png',   pos: 'center 30%' },
          { src: '/images/brand/art-direction/p17_052_736x981.png',    pos: 'center'     },
          { src: '/images/brand/art-direction/p11_028_736x1041.png',   pos: 'center'     },
          { src: '/images/brand/art-direction/p16_048_736x736.png',    pos: 'center'     },
          { src: '/images/brand/art-direction/p17_054_564x564.png',    pos: 'center 40%' },
        ].map(({ src, pos }, i) => (
          <div key={i} style={{ position: 'relative', overflow: 'hidden' }}>
            <Image
              src={src} alt="" fill unoptimized sizes="20vw"
              style={{ objectFit: 'cover', objectPosition: pos, filter: 'contrast(1.08) saturate(0.78) brightness(0.65)' }}
            />
          </div>
        ))}
      </div>

      {/* ── FULL-BLEED PHOTO MOSAIC — venue imagery before contact info ── */}
      <div
        aria-hidden="true"
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.2fr 1.2fr 1.2fr 2fr',
          gap: '3px',
          marginBottom: 0,
          height: 'clamp(180px, 26vw, 360px)',
          position: 'relative', zIndex: 1,
          margin: '0 calc(-1 * clamp(24px, 6vw, 96px)) 0',
          overflow: 'hidden',
        }}
        className="ht-venue-strip"
      >
        {[
          { src: '/images/brand/venue/p08_013_2095x2793.png',          pos: 'center 30%' },
          { src: '/images/brand/signage/p06_002_528x595.png',           pos: 'center'     },
          { src: '/images/brand/interiors/p14_038_1333x941.png',        pos: 'center'     },
          { src: '/images/brand/greenery/p19_060_474x842.png',          pos: 'center'     },
          { src: '/images/brand/venue/p08_011_736x981.png',             pos: 'center 40%' },
        ].map(({ src, pos }, i) => (
          <div key={i} style={{ position: 'relative', overflow: 'hidden' }}>
            <Image
              src={src} alt="" fill unoptimized sizes="20vw"
              style={{ objectFit: 'cover', objectPosition: pos, filter: 'contrast(1.12) saturate(0.8) brightness(0.7)' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(27,14,32,0.15) 0%, rgba(27,14,32,0.55) 100%)',
            }} />
          </div>
        ))}
        {/* Black accent strip at the bottom of the mosaic */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: '#000000' }} />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionTitle jp="来" en="FIND US" eyebrow="MOTOR CITY DUBAI" reduceMotion={reduceMotion} color="#FFD01F" />

        {/* Horizontal rule */}
        <div style={{ height: '4px', background: '#FFD01F', marginBottom: 'clamp(40px, 6vw, 64px)', position: 'relative' }} />

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(32px, 5vw, 64px)', alignItems: 'start',
        }} className="ht-contact-grid">

          {/* Address */}
          <div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '11px',
              fontWeight: 800, letterSpacing: '0.44em',
              color: '#FFD01F', marginBottom: '18px',
              borderLeft: '3px solid #FFD01F', paddingLeft: '12px',
            }}>ADDRESS</p>
            <address style={{ fontStyle: 'normal' }}>
              <p style={{
                fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: 'clamp(20px, 2.4vw, 30px)',
                letterSpacing: '-0.01em', color: '#FFFFFF',
                lineHeight: 1.3, margin: '0 0 10px',
              }}>
                MOTOR CITY<br />CLUB HOUSE
              </p>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '15px',
                letterSpacing: '0em', color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.8, margin: '0 0 28px',
              }}>
                Dubai Motor City<br />Dubai, UAE
              </p>
            </address>
            <button
              onClick={onReserve}
              style={{
                fontFamily: 'var(--font-body)', fontSize: '13px',
                fontWeight: 800, letterSpacing: '0.3em',
                color: '#111111', background: '#FFD01F',
                border: 'none', padding: '18px 36px',
                borderRadius: '40px',
                cursor: 'pointer', minHeight: '54px',
                transition: 'background 0.2s, transform 0.18s',
                display: 'inline-flex', alignItems: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E8B800'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FFD01F'; e.currentTarget.style.transform = 'none'; }}
            >BOOK YOUR TABLE →</button>
          </div>

          {/* Hours */}
          <div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '11px',
              fontWeight: 800, letterSpacing: '0.44em',
              color: '#FFD01F', marginBottom: '18px',
              borderLeft: '3px solid #FFD01F', paddingLeft: '12px',
            }}>HOURS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {HOURS.map(h => (
                <div key={h.day} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', gap: '16px',
                  borderBottom: '1px solid rgba(255,255,255,0.18)',
                  paddingBottom: '12px',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '14px',
                    fontWeight: 700, letterSpacing: '0.22em',
                    color: h.time === 'CLOSED' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.9)',
                  }}>{h.day}</span>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '14px',
                    fontWeight: 700, letterSpacing: '0.12em',
                    color: h.time === 'CLOSED' ? 'rgba(255,255,255,0.25)' : '#FFD01F',
                  }}>{h.time}</span>
                </div>
              ))}
            </div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '13px',
              letterSpacing: '0em', color: 'rgba(255,255,255,0.7)',
              marginTop: '18px', lineHeight: 1.7,
            }}>
              Kitchen closes 1 hour before.<br />
              Rooftop open Fri &amp; Sat nights.
            </p>
          </div>

          {/* Connect */}
          <div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '11px',
              fontWeight: 800, letterSpacing: '0.44em',
              color: '#FFD01F', marginBottom: '18px',
              borderLeft: '3px solid #FFD01F', paddingLeft: '12px',
            }}>CONNECT</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <a href="mailto:hello@heytiger.ae" style={{
                fontFamily: 'var(--font-body)', fontSize: '15px',
                fontWeight: 700, letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.95)', textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.2)',
                paddingBottom: '16px', transition: 'color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FFD01F'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.95)'; }}
              >HELLO@HEYTIGER.AE</a>
              <a href="https://instagram.com/heytigerdb" target="_blank" rel="noopener noreferrer" style={{
                fontFamily: 'var(--font-body)', fontSize: '15px',
                fontWeight: 700, letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.95)', textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.2)',
                paddingBottom: '16px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#FFD01F'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.95)'; }}
              >@HEYTIGERDB <span aria-hidden="true" style={{ fontSize: '12px', opacity: 0.5 }}>↗</span></a>
              <a href="https://maps.google.com/?q=Motor+City+Club+House+Dubai" target="_blank" rel="noopener noreferrer" style={{
                fontFamily: 'var(--font-body)', fontSize: '15px',
                fontWeight: 700, letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.95)', textDecoration: 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#FFD01F'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.95)'; }}
              >GET DIRECTIONS <span aria-hidden="true" style={{ fontSize: '12px', opacity: 0.5 }}>↗</span></a>
            </div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '12px',
              fontWeight: 700, letterSpacing: '0.36em',
              color: 'rgba(255,255,255,0.45)', marginBottom: '10px',
            }}>A BRASS MONKEY HOSPITALITY VENUE</p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .ht-contact-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .ht-contact-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) { .ht-venue-strip { grid-template-columns: 1fr 1fr 1fr !important; } }
        @media (max-width: 480px) { .ht-venue-strip { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </section>
  );
}
