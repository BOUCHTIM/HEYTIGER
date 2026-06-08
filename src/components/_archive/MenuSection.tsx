// ARCHIVED — possibly used on secondary pages.
// Confirm usage before restoring. Do not import from active components.
// Archived: 2026-05-31
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import SectionTitle from './SectionTitle';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

type Category = 'all' | 'food' | 'sushi' | 'drinks';

const ITEMS = [
  { name: 'YAKITORI',        jp: '焼き鳥',        desc: 'Grilled skewers over binchotan charcoal. Chicken thigh, tsukune, leek.',     tag: 'food',   price: 'AED 45', photo: '/images/brand/art-direction/p09_015_1200x1500.png', badge: 'STREET FOOD' },
  { name: 'KATSU SANDO',     jp: 'カツサンド',     desc: 'Crispy wagyu katsu, milk bread, house tonkatsu sauce.',                       tag: 'food',   price: 'AED 68', photo: '/images/brand/art-direction/p09_016_1200x1800.png', badge: 'SIGNATURE'   },
  { name: 'TIGER ROLL',      jp: 'タイガーロール',  desc: 'Spicy tuna, cucumber, avocado, tiger sauce, tobiko.',                         tag: 'sushi',  price: 'AED 88', photo: '/images/brand/art-direction/p10_023_736x1104.png',  badge: 'SUSHI BAR'   },
  { name: 'SUSHI TACOS',     jp: '寿司タコス',     desc: 'Nori shell, salmon, yuzu crème, ikura, crispy shallots.',                     tag: 'sushi',  price: 'AED 72', photo: '/images/brand/art-direction/p11_029_1177x1618.png', badge: 'SUSHI BAR'   },
  { name: 'TIGER SOUR',      jp: 'タイガーサワー',  desc: 'Yuzu sake, lemon, egg white, bitters. The house pour.',                       tag: 'drinks', price: 'AED 55', photo: '/images/brand/art-direction/p12_030_736x983.png',  badge: 'COCKTAILS'   },
  { name: 'MATCHA HIGHBALL', jp: '抹茶ハイボール',  desc: 'Japanese whisky, ceremonial matcha, soda, lime zest.',                        tag: 'drinks', price: 'AED 62', photo: '/images/brand/art-direction/p16_049_1200x1799.png', badge: 'COCKTAILS'   },
];

const FILTERS: { label: string; value: Category }[] = [
  { label: 'ALL',         value: 'all'    },
  { label: 'STREET FOOD', value: 'food'   },
  { label: 'SUSHI BAR',   value: 'sushi'  },
  { label: 'COCKTAILS',   value: 'drinks' },
];

const BADGE_COLOR: Record<string, string> = {
  'STREET FOOD': '#7A806B',
  SIGNATURE:     '#C54834',
  'SUSHI BAR':   '#2a6b5a',
  COCKTAILS:     '#D86A3A',
};

export default function MenuSection({ reduceMotion }: { reduceMotion: boolean }) {
  const [active, setActive] = useState<Category>('all');
  const filtered = active === 'all' ? ITEMS : ITEMS.filter(it => it.tag === active);

  return (
    <section
      id="menu"
      aria-label="The Menu"
      style={{
        background: '#1C4D2C',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Halftone texture on yellow */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)',
        backgroundSize: '10px 10px',
        mixBlendMode: 'multiply', opacity: 0.4,
      }} />

      {/* ── Cinematic scroll intro ── */}
      <ContainerScroll
        titleComponent={
          <div style={{ textAlign: 'center', padding: '0 24px' }}>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '13px',
              fontWeight: 900, letterSpacing: '0.44em',
              color: '#FFD01F', marginBottom: '16px',
            }}>CURATED IN TOKYO · CRAFTED IN DUBAI</p>
            <div style={{
              fontFamily: 'var(--font-jp)',
              fontSize: 'clamp(52px, 7vw, 88px)',
              lineHeight: 1, color: '#FFD01F',
              letterSpacing: '-0.01em',
              fontWeight: 900,
            }}>
              食
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(11px, 1vw, 13px)',
              fontWeight: 800, letterSpacing: '0.38em',
              color: 'rgba(255,208,31,0.6)',
              marginTop: '10px',
              textTransform: 'uppercase',
            }}>
              THE MENU
            </div>
          </div>
        }
      >
        {/* 2×2 image grid inside the 3D card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', height: '100%', gap: '4px' }}>
          {[
            '/images/brand/art-direction/p10_021_736x1041.png',
            '/images/brand/art-direction/p15_044_1734x1931.png',
            '/images/brand/art-direction/p17_053_1295x827.png',
            '/images/brand/art-direction/p12_032_1026x1026.png',
          ].map((src, i) => (
            <div key={i} style={{ position: 'relative', overflow: 'hidden', minHeight: '160px' }}>
              <Image
                src={src} alt="" fill unoptimized
                sizes="25vw"
                style={{ objectFit: 'cover', objectPosition: 'center', filter: 'contrast(1.1) saturate(0.9) brightness(0.85)' }}
              />
              {/* Halftone per cell */}
              <div aria-hidden="true" style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'radial-gradient(circle, rgba(20,20,20,0.2) 1px, transparent 1px)',
                backgroundSize: '5px 5px',
                mixBlendMode: 'multiply',
              }} />
            </div>
          ))}
        </div>
      </ContainerScroll>

      {/* Ghost kanji */}
      <div aria-hidden="true" style={{
        position: 'absolute', left: '-2%', bottom: '-4%',
        fontFamily: 'var(--font-jp)', fontWeight: 900,
        fontSize: 'clamp(180px, 30vw, 500px)', lineHeight: 1,
        color: 'rgba(255,208,31,0.06)', userSelect: 'none', pointerEvents: 'none',
        zIndex: 0,
      }}>食</div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 clamp(28px, 6vw, 96px) clamp(80px, 11vw, 160px)' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', marginBottom: 'clamp(32px, 5vw, 52px)' }}>
          <SectionTitle
            jp="食"
            en="THE MENU"
            eyebrow="CURATED IN TOKYO · CRAFTED IN DUBAI"
            reduceMotion={reduceMotion}
            style={{ marginBottom: 0 }}
            color="#FFD01F"
          />
          <motion.p
            initial={reduceMotion ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(14px, 1.2vw, 16px)',
              letterSpacing: '0em', lineHeight: 1.9,
              color: 'rgba(255,255,255,0.78)', maxWidth: '38ch',
              margin: '0 0 clamp(40px, 6vw, 72px)', alignSelf: 'flex-end',
            }}
          >
            From binchotan yakitori to craft cocktails — every dish tells part of the Tiger story.
          </motion.p>
        </div>

        {/* Cuisine CTA */}
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          style={{
            marginBottom: 'clamp(40px, 6vw, 64px)',
            padding: 'clamp(24px, 3.5vw, 40px)',
            background: '#111111',
            border: '3px solid #111111',
            borderLeft: '8px solid #C54834',
            display: 'grid', gridTemplateColumns: '1fr auto',
            gap: 'clamp(24px, 4vw, 48px)', alignItems: 'center',
          }}
          className="ht-menu-cta-grid"
        >
          <div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '13px',
              fontWeight: 800, letterSpacing: '0.44em',
              color: '#C54834', margin: '0 0 16px',
            }}>OUR PHILOSOPHY</p>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(14px, 1.3vw, 17px)',
              letterSpacing: '0em', lineHeight: 1.9,
              color: 'rgba(255,208,31,0.92)', margin: '0 0 12px',
            }}>
              We don&apos;t do fusion for fusion&apos;s sake. Every plate at Hey Tiger is a
              conversation between two worlds — the precision of Tokyo&apos;s izakayas
              and the boldness of Dubai&apos;s streets.
            </p>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(14px, 1.3vw, 17px)',
              letterSpacing: '0em', lineHeight: 1.9,
              color: 'rgba(255,208,31,0.92)', margin: 0,
            }}>
              From binchotan-grilled yakitori and house-pressed wagyu sando
              to omakase rolls and 47 sake labels — this is Japanese soul food,
              elevated. Specialties include our signature Tiger Roll,
              the Katsu Sando, and the Tiger Sour — order all three.
            </p>
          </div>
          <div lang="ja" style={{
            fontFamily: 'var(--font-jp-rough)', fontSize: 'clamp(52px, 7vw, 92px)',
            color: 'rgba(197,72,52,0.18)', letterSpacing: '-0.02em', lineHeight: 1,
            userSelect: 'none', flexShrink: 0,
            textShadow: '2px 4px 0 rgba(0,0,0,0.3)',
          }}>食</div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          role="group"
          aria-label="Filter menu items"
          style={{
            display: 'flex', gap: '4px', flexWrap: 'wrap',
            marginBottom: 'clamp(32px, 5vw, 56px)',
            background: '#111111',
            padding: '4px', width: 'fit-content',
          }}
        >
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              aria-pressed={active === f.value}
              style={{
                fontFamily: 'var(--font-body)', fontSize: '13px',
                fontWeight: 800, letterSpacing: '0.26em',
                padding: '12px 24px', cursor: 'pointer', border: 'none',
                background: 'transparent',
                color: active === f.value ? '#111111' : 'rgba(255,255,255,0.6)',
                transition: 'color 0.22s', minHeight: '48px', position: 'relative',
              }}
            >
              {active === f.value && (
                <motion.span
                  layoutId="menu-filter-bg"
                  style={{ position: 'absolute', inset: 0, background: '#FFD01F', zIndex: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>{f.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Card grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'clamp(16px, 2.2vw, 28px)' }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.article
                key={item.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                whileHover={reduceMotion ? {} : { y: -7, boxShadow: '0 20px 52px rgba(197,72,52,0.18), 0 4px 16px rgba(0,0,0,0.22)' }}
                transition={{ duration: 0.28, delay: i * 0.04 }}
                style={{
                  background: 'rgba(10,30,15,0.92)', overflow: 'hidden',
                  display: 'flex', flexDirection: 'column',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
                  border: '3px solid #111111',
                  outline: '1px solid transparent', transition: 'outline-color 0.25s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.outlineColor = 'rgba(197,72,52,0.3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.outlineColor = 'transparent'; }}
              >
                <div style={{ position: 'relative', aspectRatio: '4/3', flexShrink: 0, overflow: 'hidden' }}>
                  <Image
                    src={item.photo} alt={item.name} fill unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: 'cover', objectPosition: 'center', filter: 'contrast(1.08) saturate(0.9) brightness(0.85)' }}
                  />
                  {/* Halftone on card photo */}
                  <div aria-hidden="true" style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'radial-gradient(circle, rgba(20,20,20,0.18) 1px, transparent 1px)',
                    backgroundSize: '6px 6px',
                    mixBlendMode: 'multiply',
                  }} />
                  <div style={{
                    position: 'absolute', top: '12px', left: '12px',
                    background: BADGE_COLOR[item.badge] || '#C54834',
                    color: '#FFCC00', fontFamily: 'var(--font-body)',
                    fontSize: '10px', fontWeight: 800, letterSpacing: '0.32em', padding: '6px 12px',
                  }}>{item.badge}</div>
                </div>

                <div style={{ padding: '22px 24px 26px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div>
                      <h3 style={{
                        fontFamily: 'var(--font-display)', fontWeight: 900,
                        fontSize: 'clamp(20px, 2.2vw, 26px)',
                        letterSpacing: '-0.01em', color: '#FFD01F',
                        margin: 0, lineHeight: 1,
                      }}>{item.name}</h3>
                      <p lang="ja" style={{
                        fontFamily: 'var(--font-jp)', fontSize: '14px',
                        letterSpacing: '0.16em', color: '#C54834', margin: '6px 0 0',
                      }}>{item.jp}</p>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '15px',
                      fontWeight: 800, letterSpacing: '0.08em',
                      color: '#C54834', whiteSpace: 'nowrap',
                      flexShrink: 0, marginTop: '2px',
                    }}>{item.price}</span>
                  </div>
                  <div style={{ height: '2px', background: 'rgba(255,255,255,0.12)' }} />
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '14px',
                    letterSpacing: '0em', lineHeight: 1.8,
                    color: 'rgba(255,255,255,0.82)', margin: 0,
                  }}>{item.desc}</p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Materials & craft photo strip ── */}
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ marginTop: 'clamp(48px, 7vw, 88px)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 800, letterSpacing: '0.44em', color: 'rgba(255,255,255,0.5)', margin: 0, whiteSpace: 'nowrap' }}>CRAFT · DETAIL · TECHNIQUE</p>
            <div style={{ height: '3px', flex: 1, background: 'rgba(255,255,255,0.2)' }} />
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '4px',
            height: 'clamp(140px, 20vw, 260px)',
          }} className="ht-menu-photo-strip">
            {[
              { src: '/images/brand/materials/p18_055_736x1038.png',        pos: 'center' },
              { src: '/images/brand/materials/p18_056_720x899.png',          pos: 'center' },
              { src: '/images/brand/materials/p18_057_632x949.png',          pos: 'center' },
              { src: '/images/brand/materials/p18_058_800x1112.png',         pos: 'center' },
            ].map(({ src, pos }, i) => (
              <div key={i} style={{ position: 'relative', overflow: 'hidden' }}>
                <Image
                  src={src} alt="" fill unoptimized sizes="25vw"
                  style={{ objectFit: 'cover', objectPosition: pos, filter: 'contrast(1.1) saturate(0.85) brightness(0.78)' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.45) 100%)',
                }} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Full menu CTA */}
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ marginTop: 'clamp(48px, 7vw, 88px)', display: 'flex', justifyContent: 'center' }}
        >
          <a
            href="/menu"
            style={{
              fontFamily: 'var(--font-body)', fontSize: '14px',
              fontWeight: 800, letterSpacing: '0.36em',
              color: '#C54834', background: 'transparent',
              border: '2px solid #C54834', padding: '20px 60px',
              borderRadius: '40px',
              textDecoration: 'none', transition: 'background 0.22s, color 0.22s',
              display: 'inline-flex', alignItems: 'center', minHeight: '56px',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#C54834'; e.currentTarget.style.color = '#1b0e20'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C54834'; }}
          >
            EXPLORE FULL MENU →
          </a>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .ht-menu-cta-grid { grid-template-columns: 1fr !important; }
          .ht-menu-cta-grid > [lang] { display: none; }
          .ht-menu-photo-strip { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
