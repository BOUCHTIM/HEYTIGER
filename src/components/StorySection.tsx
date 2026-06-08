'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const ACTS = [
  {
    num:     '01',
    act:     'ACT I',
    numJp:   '第一章',
    title:   'THE CALL',
    titleJp: '深い暗闇',
    lead:    'A RED PHONE YOU DIDN’T DIAL.',
    lines: [
      'The room is windowless.',
      'The sake is cold.',
      'Someone found you.',
    ],
    imgSrc:        '/images/spaces/entrance.jpg',
    accent:        'var(--clr-red)',
    sticker:       '/sticker1.png',
    stickerRotate: '-14deg',
    stickerPos:    { top: '18px', right: '22px' },
  },
  {
    num:     '02',
    act:     'ACT II',
    numJp:   '第二章',
    title:   'THE CODE',
    titleJp: '裏の掟',
    lead:    'BINCHOTAN AT 800°. WAGYU BARELY TOUCHES IT.',
    lines: [
      'We don’t advertise.',
      'We pour, we wait,',
      'we remember.',
    ],
    imgSrc:        '/images/story/the-story-photo.png',
    accent:        'var(--clr-red)',
    sticker:       '/sticker3.png',
    stickerRotate: '10deg',
    stickerPos:    { top: '18px', right: '18px' },
  },
  {
    num:     '03',
    act:     'ACT III',
    numJp:   '第三章',
    title:   'THE FEAST',
    titleJp: '饗宴',
    lead:    'RAMEN AT 2AM. SAKE UNTIL SUNRISE.',
    lines: [
      'Six worlds on one menu.',
      'Forty-seven sake labels.',
      'One address.',
    ],
    imgSrc:        '/images/spaces/rooftop.jpg',
    accent:        '#FDBE06',
    sticker:       '/sticker5.png',
    stickerRotate: '-7deg',
    stickerPos:    { top: '22px', left: '18px' },
  },
];

function ActPanel({ act, index, reduceMotion }: {
  act: typeof ACTS[number];
  index: number;
  reduceMotion: boolean;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });

  return (
    <div
      ref={ref}
      className="ht-act-panel"
      style={{
        position:   'relative',
        overflow:   'hidden',
        display:    'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        minHeight:  '100dvh',
        flex:       1,
        borderRight: index < ACTS.length - 1 ? '1px solid var(--clr-red-20)' : 'none',
      }}
    >
      {/* ── Background image ── */}
      <Image
        src={act.imgSrc}
        alt=""
        fill
        unoptimized
        sizes="34vw"
        style={{
          objectFit:      'cover',
          objectPosition: 'center',
          filter:         'contrast(1.1) saturate(0.7) brightness(0.55)',
          zIndex:         0,
        }}
      />

      {/* ── Atmospheric gradient overlay ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(18,13,20,0.3) 0%, rgba(18,13,20,0.18) 35%, rgba(18,13,20,0.72) 72%, rgba(18,13,20,0.96) 100%)',
      }} />

      {/* ── Warm amber tint ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: '#8B4A1C', mixBlendMode: 'multiply', opacity: 0.22,
      }} />

      {/* ── Ghost numeral — Fix 6: reduced size + bottom-right anchor ── */}
      <div aria-hidden="true" style={{
        position:     'absolute',
        bottom:       '-0.04em',
        right:        '-0.04em',
        fontFamily:   'var(--font-display)',
        fontSize:     'clamp(140px, 22vw, 280px)',
        fontWeight:   900,
        lineHeight:   1,
        letterSpacing:'-0.04em',
        color:        `rgba(${act.accent === '#FDBE06' ? '253,190,6' : '200,61,32'},0.09)`,
        pointerEvents:'none',
        userSelect:   'none',
        zIndex:       3,
      }}>
        {act.num}
      </div>

      {/* ── Sticker — P3: wrapper aria-hidden so screen readers skip it ── */}
      <div
        aria-hidden="true"
        role="presentation"
        style={{
          position:  'absolute',
          zIndex:    6,
          ...act.stickerPos,
        }}
      >
        <Image
          src={act.sticker}
          alt=""
          width={110}
          height={110}
          unoptimized
          style={{
            width:     'clamp(72px, 9vw, 110px)',
            height:    'auto',
            transform: `rotate(${act.stickerRotate})`,
            filter:    'drop-shadow(0 6px 18px rgba(0,0,0,0.55))',
          }}
        />
      </div>

      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 5, padding: 'clamp(24px, 4vw, 40px) clamp(20px, 3.5vw, 36px)', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Eyebrow */}
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <span style={{
            fontFamily:    'var(--font-body)',
            fontSize:      '9px',
            fontWeight:    900,
            letterSpacing: '0.52em',
            color:         act.accent,
            textTransform: 'uppercase',
          }}>
            {act.act} · {act.num}
          </span>
          <div style={{ flex: 1, height: '1px', background: act.accent, opacity: 0.25 }} />
          <span lang="ja" style={{
            fontFamily:    'var(--font-jp)',
            fontSize:      '10px',
            letterSpacing: '0.12em',
            color:         act.accent,
            opacity:       0.7,
          }}>
            {act.numJp}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={reduceMotion ? {} : { opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: index * 0.08 + 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            margin:        0,
            fontFamily:    'var(--font-display)',
            fontWeight:    900,
            fontSize:      'clamp(44px, 6.5vw, 88px)',
            lineHeight:    0.9,
            letterSpacing: '-0.025em',
            textTransform: 'uppercase',
            color:         'var(--clr-cream)',
            display:       'inline-block',
            animation:     reduceMotion ? 'none' : `neonFlickerRed 4s infinite ${['0s','0.3s','0.6s'][index]}`,
          }}
        >
          {act.title}
        </motion.h2>

        {/* JP */}
        <motion.p
          initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: index * 0.08 + 0.18, ease: [0.16, 1, 0.3, 1] }}
          lang="ja"
          style={{
            margin:        0,
            fontFamily:    'var(--font-jp)',
            fontSize:      'clamp(14px, 1.8vw, 22px)',
            fontWeight:    700,
            letterSpacing: '0.16em',
            color:         act.accent,
          }}
        >
          {act.titleJp}
        </motion.p>

        {/* Red rule */}
        <motion.div
          initial={reduceMotion ? {} : { scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.55, delay: index * 0.08 + 0.24, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: '2px', width: 'clamp(44px, 6vw, 72px)', background: act.accent }}
        />

        {/* Lead */}
        <motion.p
          initial={reduceMotion ? {} : { opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.08 + 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            margin:        0,
            fontFamily:    'var(--font-body)',
            fontSize:      'clamp(11px, 1.1vw, 14px)',
            fontWeight:    800,
            letterSpacing: '0.06em',
            lineHeight:    1.4,
            color:         'var(--clr-cream)',
            textTransform: 'uppercase',
          }}
        >
          {act.lead}
        </motion.p>

        {/* Body lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {act.lines.map((line, i) => (
            <motion.p
              key={i}
              initial={reduceMotion ? {} : { opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: index * 0.08 + 0.38 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              style={{
                margin:        0,
                fontFamily:    'var(--font-body)',
                fontSize:      'clamp(13px, 1vw, 15px)',
                fontWeight:    400,
                letterSpacing: '0.01em',
                lineHeight:    1.65,
                color:         'rgba(240,235,216,0.72)',
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Footer micro row */}
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.08 + 0.62 }}
          style={{
            marginTop:     '8px',
            paddingTop:    '10px',
            borderTop:     `1px solid ${act.accent}`,
            opacity:       0.4,
            display:       'flex',
            justifyContent:'space-between',
            alignItems:    'center',
          }}
        >
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', fontWeight: 900, letterSpacing: 'var(--tracking-ultra)', color: 'var(--clr-cream)', textTransform: 'uppercase' }}>HEY, TIGER</span>
          <span lang="ja" style={{ fontFamily: 'var(--font-jp)', fontSize: '9px', color: 'var(--clr-cream)', letterSpacing: '0.12em' }}>{act.numJp}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', fontWeight: 900, letterSpacing: '0.4em', color: 'var(--clr-cream)' }}>{act.num}/03</span>
        </motion.div>
      </div>
    </div>
  );
}

export default function StorySection({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section id="story" aria-label="The Story" style={{ background: 'var(--clr-void)' }}>

      {/* Section header */}
      <div style={{
        padding:       'clamp(28px, 4vw, 48px) clamp(24px, 5vw, 64px) clamp(20px, 2.5vw, 32px)',
        display:       'flex',
        alignItems:    'baseline',
        gap:           '20px',
        borderBottom:  '1px solid var(--clr-red-10)',
      }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 900, letterSpacing: '0.5em', color: 'var(--clr-red-60)', textTransform: 'uppercase' }}>
          THE STORY
        </span>
        <div style={{ height: '1px', flex: 1, background: 'var(--clr-red-10)' }} />
        <span lang="ja" style={{ fontFamily: 'var(--font-jp)', fontSize: 'var(--text-label)', letterSpacing: '0.18em', color: 'var(--clr-red-60)' }}>物語</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 700, letterSpacing: '0.32em', color: 'rgba(240,235,216,0.25)' }}>
          MOTOR CITY · DUBAI
        </span>
      </div>

      {/* Triptych */}
      <div
        className="ht-story-triptych"
        style={{ display: 'flex', alignItems: 'stretch' }}
      >
        {ACTS.map((act, i) => (
          <ActPanel key={act.num} act={act} index={i} reduceMotion={reduceMotion} />
        ))}
      </div>

      <style>{`
        @media (max-width: 600px) {
          .ht-act-panel {
            min-height: 80dvh !important;
            border-right: none !important;
            border-bottom: 1px solid var(--clr-red-20) !important;
          }
          .ht-story-triptych {
            flex-direction: column !important;
          }
        }
      `}</style>
    </section>
  );
}
