'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const COLLAGE = [
  { src: '/images/brand/greenery/p19_061_683x1024.png', pos: 'center' },
  { src: '/images/brand/greenery/p19_062_735x916.png',  pos: 'center' },
  { src: '/images/spaces/corridor.jpg',                 pos: 'center' },
  { src: '/images/brand/greenery/p19_059_736x1125.png', pos: 'center' },
  { src: '/images/brand/interiors/p14_041_716x988.png', pos: 'center' },
  { src: '/images/brand/greenery/p19_060_474x842.png',  pos: 'center' },
];

export default function FormFunction({ reduceMotion }: { reduceMotion: boolean }) {
  const fade = (delay = 0) => ({
    initial: reduceMotion ? {} : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-10% 0px' },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  });

  return (
    <section
      aria-label="Form meets function — the Hey Tiger experience"
      style={{ background: 'var(--clr-void)', borderTop: '1px solid var(--border-structural)', position: 'relative', overflow: 'hidden' }}
    >
      <div
        className="ht-ff-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: '1360px',
          margin: '0 auto',
          alignItems: 'stretch',
        }}
      >
        {/* ── Text ── */}
        <motion.div {...fade(0)} style={{ padding: 'clamp(48px, 6vw, 96px) clamp(28px, 4vw, 64px)' }}>
          <h2
            aria-label="Form meets function — the Hey Tiger experience"
            style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(44px, 6.5vw, 104px)', lineHeight: 0.88,
              letterSpacing: 'var(--tracking-tight)', color: 'var(--clr-red)', margin: '0 0 28px',
            }}
          >FORM<br />MEETS<br />FUNCTION</h2>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(13px, 1.05vw, 16px)',
            letterSpacing: '0.03em', lineHeight: 1.85, color: 'var(--clr-cream-70)',
            maxWidth: '56ch', margin: '0 0 28px',
          }}>
            At Hey, Tiger, nothing is just for show — every detail growls with purpose.
            From the crackle of the lights to the curve of a chair, from the grit of the
            bar top to the shadows on the wall, every piece is designed to feel alive,
            like it&apos;s carrying a story worth telling. This is more than design — it&apos;s
            the Hey, Tiger experience, where the environment itself moves with the roar.
          </p>

          <span style={{
            display: 'inline-block', fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(20px, 2vw, 30px)', letterSpacing: 'var(--tracking-tight)',
            color: '#FDBE06', lineHeight: 1,
          }}>READ THIS SHIT.</span>
        </motion.div>

        {/* ── Collage ── */}
        <motion.div {...fade(0.15)} style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px',
          borderLeft: '1px solid var(--border-structural)', minHeight: '420px',
        }} className="ht-ff-collage">
          {COLLAGE.map(({ src, pos }, i) => (
            <div key={i} style={{ position: 'relative', overflow: 'hidden', background: 'var(--clr-void)' }}>
              <Image src={src} alt="" fill unoptimized sizes="20vw"
                style={{ objectFit: 'cover', objectPosition: pos, filter: 'contrast(1.05) saturate(0.95) brightness(0.82)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(18,13,20,0.18)', pointerEvents: 'none' }} />
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .ht-ff-grid { grid-template-columns: 1fr !important; }
          .ht-ff-collage { border-left: none !important; border-top: 1px solid var(--border-structural); min-height: 320px !important; }
        }
      `}</style>
    </section>
  );
}
