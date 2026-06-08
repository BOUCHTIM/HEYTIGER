'use client';

import { motion } from 'framer-motion';

export type NewspaperSection = {
  num: string;
  id: string;
  label: string;
  jp: string;
  tagline: string;
  accent?: string;
};

export default function NewspaperSectionIndex({
  sections,
  reduceMotion,
  onScrollTo,
}: {
  sections: NewspaperSection[];
  reduceMotion: boolean;
  onScrollTo: (id: string) => void;
}) {
  return (
    <div
      aria-label="Section index"
      style={{
        borderTop: '2px solid var(--border-structural)',
        backgroundColor: 'var(--clr-void)',
        padding: 'clamp(20px, 2.8vw, 36px) clamp(20px, 4vw, 64px)',
      }}
    >
      {/* Coming soon status badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: 'clamp(16px, 2vw, 24px)' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', fontWeight: 900,
          letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'var(--clr-void)', background: 'var(--clr-red)', padding: '7px 16px',
        }}>
          <span aria-hidden="true" style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--clr-void)', display: 'inline-block' }} />
          OPEN NOW
        </span>
        <span lang="ja" style={{ fontFamily: 'var(--font-jp)', fontSize: 'var(--text-body)', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--clr-red-80)' }}>近日オープン</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-structural)' }} />
      </div>

      <div
        className="dw-header-grid"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '9px',
          fontWeight: 900,
          letterSpacing: 'var(--tracking-ultra)',
          color: 'var(--clr-red-60)',
          marginBottom: 'clamp(12px, 1.6vw, 18px)',
        }}
      >
        <span className="dw-header-index">NO.</span>
        <span>SECTION</span>
        <span className="dw-header-tagline">DESCRIPTION</span>
        <span style={{ textAlign: 'right' }} aria-hidden="true">→</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {sections.map((sec, i) => (
          <motion.button
            key={sec.id}
            type="button"
            initial={reduceMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onScrollTo(sec.id)}
            className="dw-row-grid"
            style={{
              width: '100%',
              textAlign: 'left',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(240,235,216,0.06)',
              cursor: 'pointer',
              padding: 'clamp(14px, 1.8vh, 22px) 0',
              color: 'inherit',
              transition: 'background var(--dur-fast) var(--ease-standard)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--clr-red-10)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span
              className="dw-col-index"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(11px, 0.9vw, 13px)',
                fontWeight: 900,
                letterSpacing: '0.28em',
                color: sec.accent ?? 'rgba(253, 190, 6, 1)',
              }}
            >
              {sec.num}
            </span>

            <span style={{ minWidth: 0 }}>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: 'clamp(22px, 3.2vw, 42px)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  color: 'var(--clr-cream)',
                }}
              >
                {sec.label}
              </span>
              <span
                lang="ja"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-jp)',
                  fontSize: 'clamp(12px, 1vw, 14px)',
                  letterSpacing: '0.14em',
                  color: 'var(--clr-red-80)',
                  marginTop: '4px',
                }}
              >
                {sec.jp}
              </span>
            </span>

            <span
              className="dw-col-tagline"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(10px, 0.82vw, 12px)',
                fontWeight: 700,
                letterSpacing: '0.22em',
                color: 'rgba(240,235,216,0.5)',
                lineHeight: 1.5,
              }}
            >
              {sec.tagline}
            </span>

            <span
              aria-hidden="true"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(16px, 1.6vw, 22px)',
                fontWeight: 900,
                color: sec.accent ?? 'rgba(253, 190, 6, 1)',
                textAlign: 'right',
                alignSelf: 'center',
              }}
            >
              →
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
