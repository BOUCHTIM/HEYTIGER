'use client';

import { useEffect, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import type { SignData } from './signs';

const EASE = [0.16, 1, 0.3, 1] as const;
const MONO = "'Courier New', ui-monospace, monospace";
const JP = "var(--font-japanese-serif, 'Noto Serif JP', serif)";

/* items reveal after the board finishes morphing open */
const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.32 } } };
const row: Variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } };

export default function SignExpanded({
  sign,
  isMobile,
  reduceMotion,
  onClose,
}: {
  sign: SignData;
  isMobile: boolean;
  reduceMotion: boolean;
  onClose: () => void;
}) {
  const kanjiColor = sign.accent ?? sign.color;
  const variants = reduceMotion ? undefined : list;
  const rowV = reduceMotion ? undefined : row;
  const closeRef = useRef<HTMLButtonElement>(null);

  // move focus into the dialog when it opens (esc-to-close lives in the parent)
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(10,10,8,0.85)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? 0 : 'clamp(16px, 4vw, 48px)',
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${sign.en} menu`}
        layoutId={`sign-${sign.id}`}
        onClick={(e) => e.stopPropagation()}
        initial={reduceMotion ? false : { rotate: sign.rotation }}
        animate={{ rotate: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        style={{
          position: 'relative',
          width: isMobile ? '100vw' : 'min(80vw, 760px)',
          height: isMobile ? '100dvh' : 'auto',
          maxHeight: isMobile ? 'none' : '82vh',
          backgroundColor: sign.bg,
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 3px), radial-gradient(120% 90% at 30% 0%, rgba(255,255,255,0.05), transparent 55%), radial-gradient(120% 90% at 80% 100%, rgba(0,0,0,0.1), transparent 60%)',
          color: sign.color,
          borderRadius: isMobile ? 0 : 4,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
        }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          style={{
            position: isMobile ? 'fixed' : 'absolute',
            top: isMobile ? 16 : 'clamp(14px, 2vw, 22px)',
            right: isMobile ? 16 : 'clamp(14px, 2vw, 22px)',
            zIndex: 3,
            background: 'transparent',
            border: 0,
            cursor: 'pointer',
            color: sign.color,
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            letterSpacing: '0.14em',
            opacity: 0.75,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>×</span>
          <span lang="ja">閉じる</span>
        </button>

        <motion.div
          data-lenis-prevent
          variants={variants}
          initial="hidden"
          animate="show"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: isMobile
              ? 'clamp(64px, 12vw, 80px) clamp(22px, 7vw, 32px) clamp(40px, 12vw, 56px)'
              : 'clamp(48px, 5vw, 72px) clamp(40px, 5vw, 64px) clamp(40px, 5vw, 56px)',
          }}
        >
          {/* header */}
          <motion.div variants={rowV} style={{ marginBottom: 'clamp(28px, 4vw, 40px)' }}>
            <span lang="ja" style={{ display: 'block', fontFamily: JP, fontSize: 'clamp(3.4rem, 9vw, 5.5rem)', fontWeight: 700, lineHeight: 0.95, color: kanjiColor }}>
              {sign.kanji}
              {sign.reading && (
                <span style={{ fontSize: '0.9rem', letterSpacing: '0.22em', marginLeft: 14, opacity: 0.6, verticalAlign: 'super' }}>{sign.reading}</span>
              )}
            </span>
            <span style={{ display: 'block', marginTop: 14, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '0.01em' }}>
              {sign.en}
            </span>
            <span style={{ display: 'block', marginTop: 8, fontFamily: 'var(--font-body)', fontSize: '0.66rem', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6 }}>
              {sign.sub}
            </span>
          </motion.div>

          {/* CONTACT card (Private Events) */}
          {sign.items.length === 0 ? (
            <motion.div variants={rowV} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '48ch' }}>{sign.note}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', opacity: 0.7 }}>{sign.capacity}</p>
              <a
                href={`mailto:${sign.contact}`}
                onClick={(e) => e.stopPropagation()}
                style={{ marginTop: 6, fontFamily: MONO, fontSize: '1rem', fontWeight: 700, color: sign.color, textDecoration: 'underline', textUnderlineOffset: 5 }}
              >
                {sign.contact} →
              </a>
            </motion.div>
          ) : (
            /* ITEM list */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 2.4vw, 26px)' }}>
              {sign.items.map((it) => (
                <motion.div key={it.enName} variants={rowV}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexShrink: 0 }}>
                      <span lang="ja" style={{ fontFamily: JP, fontSize: '1.1rem', fontWeight: 700 }}>{it.jpName}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', fontWeight: 700, letterSpacing: '0.04em' }}>{it.enName}</span>
                    </span>
                    <span aria-hidden="true" style={{ flex: 1, borderBottom: '1px dotted currentColor', opacity: 0.4, transform: 'translateY(-4px)' }} />
                    <span style={{ flexShrink: 0, fontFamily: MONO, fontSize: '0.95rem', fontWeight: 700 }}>
                      {it.price}
                      <span style={{ fontSize: '0.62rem', opacity: 0.6, marginLeft: 4 }}>AED</span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', opacity: 0.66 }}>{it.description}</span>
                    {it.tag && (
                      <span style={{ flexShrink: 0, fontFamily: 'var(--font-body)', fontSize: '0.54rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '2px 7px', border: '1px solid currentColor', borderRadius: 2, opacity: 0.78, whiteSpace: 'nowrap' }}>
                        {it.tag}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* end stamp */}
          <motion.div
            variants={rowV}
            aria-hidden="true"
            style={{ textAlign: 'center', marginTop: 'clamp(32px, 4vw, 46px)', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.1)', fontFamily: JP, fontSize: '0.7rem', letterSpacing: '0.32em', opacity: 0.4 }}
          >
            おわり
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
