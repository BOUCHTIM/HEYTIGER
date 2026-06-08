// ARCHIVED — possibly used on secondary pages.
// Confirm usage before restoring. Do not import from active components.
// Archived: 2026-05-31
'use client';

import { motion } from 'framer-motion';

interface SectionTitleProps {
  jp: string;
  en: string;
  eyebrow?: string;
  align?: 'left' | 'center';
  reduceMotion?: boolean;
  style?: React.CSSProperties;
  color?: string;
}

export default function SectionTitle({
  jp,
  en,
  eyebrow,
  align = 'left',
  reduceMotion,
  style,
  color = '#000000',
}: SectionTitleProps) {
  return (
    <div style={{ marginBottom: 'clamp(40px, 6vw, 72px)', textAlign: align, ...style }}>
      {eyebrow && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: 900,
          letterSpacing: '0.44em',
          color,
          margin: '0 0 14px',
          textTransform: 'uppercase',
        }}>
          {eyebrow}
        </p>
      )}
      <motion.div
        initial={reduceMotion ? {} : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Big kanji / JP text */}
        <div style={{
          fontFamily: 'var(--font-jp)',
          fontSize: 'clamp(36px, 5vw, 60px)',
          letterSpacing: '-0.01em',
          color,
          lineHeight: 1,
        }}>
          {jp}
        </div>
        {/* English subtitle */}
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(11px, 1vw, 13px)',
          fontWeight: 800,
          letterSpacing: '0.38em',
          color,
          opacity: 0.55,
          marginTop: '10px',
          textTransform: 'uppercase',
        }}>
          {en}
        </div>
      </motion.div>
    </div>
  );
}
