'use client';

/**
 * AboutOfferings — 2-div layout:
 *  Div 1  Left dark panel  (~58%)  — identity + offerings stacked
 *  Div 2  Right photo panel (~42%) — full-bleed + bottom overlay
 */

import Image from 'next/image';


const YELLOW  = '#F5C518';
const RED     = 'var(--clr-red)';
const MUTED   = '#9a8070';

const OFFERINGS = [
  { title: 'JAPANESE STREET FOOD',      desc: 'Yakitori, katsu sando, ramen, sushi tacos, and more.' },
  { title: 'SUSHI BAR',                 desc: 'Fresh rolls and creative sushi fusions.' },
  { title: 'CRAFT COCKTAILS & DRINKS',  desc: 'Japanese-inspired mixed drinks, beer, and signature cocktails.' },
  { title: 'LIVE DJ SETS',              desc: 'Curated beats and vinyl-style sets for a high-energy rooftop vibe.' },
  { title: 'ROOFTOP LOUNGE EXPERIENCE', desc: 'Urban-chic setting with skyline views, neon vibes, and chill seating.' },
  { title: 'WEEKEND BRUNCH',            desc: 'A rooftop takeover with bold bites and flowing drinks.' },
  { title: 'PRIVATE EVENTS',            desc: "Book the Tiger's Den for exclusive nights — skyline views, curated menus, and full audio vibes." },
];

export default function AboutOfferings({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section
      id="about"
      aria-label="About Hey Tiger"
      className="ht-about-wrap"
      style={{ display: 'flex', width: '100%', minHeight: '100vh', borderTop: '1px solid var(--border-structural)' }}
    >

      {/* ───────────────────────────────────────────────
          DIV 1  — dark identity + offerings panel
         ─────────────────────────────────────────────── */}
      <div
        style={{
          flex:          '0 0 58%',
          background:    'var(--clr-void)',
          display:       'flex',
          flexDirection: 'column',
          padding:       'clamp(32px, 4vw, 60px) clamp(28px, 4vw, 56px)',
          borderRight:   '1px solid var(--border-structural)',
          gap:           'clamp(18px, 2vw, 28px)',
        }}
      >
        {/* Tiger mascot — top right area */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-8px' }}>
          <Image
            src="/heytiger-logo.png"
            alt="Hey Tiger"
            width={160}
            height={160}
            unoptimized
            style={{ height: 'clamp(90px, 11vw, 150px)', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.9 }}
          />
        </div>

        {/* HEY, / TIGER */}
        <h2
          style={{
            fontFamily:    'var(--font-display)',
            fontWeight:    900,
            fontSize:      'clamp(88px, 11.5vw, 160px)',
            lineHeight:    0.82,
            letterSpacing: '-0.02em',
            color:         YELLOW,
            margin:        0,
            textTransform: 'uppercase',
            display:       'inline-block',
            animation:     reduceMotion ? 'none' : 'neonFlickerYellow 4.5s infinite 0.1s',
          }}
        >
          HEY,<br />TIGER
        </h2>

        <div style={{ height: '1px', background: 'var(--border-structural)' }} />

        {/* Subheadline */}
        <p
          style={{
            fontFamily:    'var(--font-barlow)',
            fontSize:      'clamp(15px, 1.6vw, 22px)',
            fontWeight:    700,
            letterSpacing: '0.02em',
            lineHeight:    1.25,
            color:         YELLOW,
            textTransform: 'uppercase',
            margin:        0,
          }}
        >
          HEY, TIGER: YOUR NEIGHBORHOOD JAPANESE SPOT. FAMILY BY DAY. AFTER-HOURS CHAOS BY NIGHT.
        </p>

        {/* Keywords — big flowing sentence (Fix 7: moved above body copy) */}
        <p
          style={{
            fontFamily:    'var(--font-bebas)',
            fontSize:      'clamp(28px, 3.4vw, 50px)',
            fontWeight:    900,
            letterSpacing: '0.02em',
            lineHeight:    1.08,
            color:         YELLOW,
            margin:        '4px 0',
          }}
        >
          COZY, UNPRETENTIOUS, VIBRANT, SOCIAL — AND LOUD AFTER MIDNIGHT.
        </p>

        {/* Body copy */}
        <p
          style={{
            fontFamily:    'var(--font-barlow)',
            fontSize:      'clamp(11px, 1vw, 14px)',
            fontWeight:    400,
            letterSpacing: '0.05em',
            lineHeight:    1.7,
            color:         'var(--clr-cream)',
            textTransform: 'uppercase',
            margin:        0,
          }}
        >
          By day, a warm table for whoever shows up. By 5PM, the after-work crowd trades stress
          for beer. As night falls, the lights dim, the bar takes over, and the room shifts into
          something else entirely. Your local Japanese with a split personality — and absolutely
          no apologies.
        </p>

        {/* TIGER'S OFFERINGS label */}
        <p
          style={{
            fontFamily:    'var(--font-bebas)',
            fontSize:      'clamp(16px, 1.7vw, 22px)',
            letterSpacing: '0.07em',
            color:         YELLOW,
            margin:        0,
            textTransform: 'uppercase',
          }}
        >
          TIGER&apos;S OFFERINGS:
        </p>

        {/* Offering list — 2-column CSS grid, no extra div wrappers */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap:                 'clamp(10px, 1.2vw, 18px) clamp(20px, 3vw, 40px)',
          }}
        >
          {OFFERINGS.map((o) => (
            <div key={o.title}>
              <p
                style={{
                  fontFamily:    'var(--font-bebas)',
                  fontSize:      'clamp(15px, 1.5vw, 20px)',
                  letterSpacing: '0.06em',
                  color:         'var(--clr-red)',
                  margin:        '0 0 3px',
                  textTransform: 'uppercase',
                }}
              >
                {o.title}
              </p>
              <p
                style={{
                  fontFamily:    'var(--font-barlow)',
                  fontSize:      'clamp(10px, 0.9vw, 13px)',
                  fontWeight:    400,
                  letterSpacing: '0.05em',
                  lineHeight:    1.55,
                  color:         MUTED,
                  textTransform: 'uppercase',
                  margin:        0,
                }}
              >
                {o.desc}
              </p>
            </div>
          ))}
        </div>

        {/* BMH logo */}
        <div style={{ marginTop: 'auto' }}>
          <Image
            src="/BMH-logo.png"
            alt="Brass Monkey Hospitality"
            width={90}
            height={64}
            unoptimized
            style={{ height: 'clamp(36px, 4vw, 52px)', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.4 }}
          />
        </div>
      </div>

      {/* ───────────────────────────────────────────────
          DIV 2  — full-bleed photo + bottom overlay
         ─────────────────────────────────────────────── */}
      <div style={{ flex: '0 0 42%', position: 'relative', overflow: 'hidden' }}>

        <Image
          src="/images/brand/venue/p08_013_2095x2793.png"
          alt="Hey Tiger — Motor City Dubai"
          fill
          unoptimized
          sizes="42vw"
          style={{ objectFit: 'cover', objectPosition: 'center 25%', filter: 'contrast(1.06) saturate(0.88) brightness(0.72)' }}
        />

        {/* Warm amber tint */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(160deg, rgba(58,26,8,0.42) 0%, rgba(18,6,4,0.22) 50%, rgba(8,2,2,0.5) 100%)',
        }} />

        {/* Bottom text overlay */}
        <div style={{
          position:   'absolute',
          bottom:     0, left: 0, right: 0,
          padding:    'clamp(28px, 4vw, 52px)',
          background: 'linear-gradient(to top, rgba(12,4,4,0.96) 0%, rgba(12,4,4,0.65) 55%, transparent 100%)',
        }}>
          <p
            style={{
              fontFamily:    'var(--font-bebas)',
              fontSize:      'clamp(22px, 2.4vw, 34px)',
              letterSpacing: '0.06em',
              color:         'var(--clr-red)',
              margin:        '0 0 4px',
              display:       'inline-block',
              animation:     reduceMotion ? 'none' : 'neonFlickerRed 4.5s infinite 0.3s',
            }}
          >
            HEY, TIGER
          </p>
          <p
            lang="ja"
            style={{
              fontFamily: 'var(--font-jp)',
              fontSize:   'clamp(40px, 5.2vw, 72px)',
              fontWeight: 700,
              color:      'var(--clr-red)',
              margin:     '0 0 clamp(14px, 2vw, 24px)',
              lineHeight: 1,
            }}
          >
            おいトラ
          </p>
          <p
            style={{
              fontFamily:    'var(--font-barlow)',
              fontSize:      'clamp(14px, 1.6vw, 22px)',
              fontWeight:    700,
              letterSpacing: '0.03em',
              lineHeight:    1.25,
              color:         'var(--clr-cream)',
              textTransform: 'uppercase',
              margin:        0,
              maxWidth:      '28ch',
            }}
          >
            FROM FAMILY COMFORT TO AFTER-HOURS CHAOS. ONE ROOF. ONE ADDRESS.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .ht-about-wrap { flex-direction: column !important; }
          .ht-about-wrap > div:first-child { flex: unset !important; border-right: none !important; border-bottom: 1px solid var(--border-structural); }
          .ht-about-wrap > div:last-child  { flex: unset !important; min-height: 60vw; }
        }
      `}</style>
    </section>
  );
}
