'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        backgroundColor: '#080608',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(48px, 8vw, 96px) clamp(24px, 5vw, 64px)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Ambient gold glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '30%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(201,162,39,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Giant kanji watermark */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-jp)',
          fontWeight: 900,
          fontSize: 'clamp(320px, 50vw, 640px)',
          color: 'rgba(201,162,39,0.05)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        迷
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: 'clamp(40px, 5vw, 64px)', position: 'relative', zIndex: 1 }}
      >
        <Link href="/" aria-label="Hey Tiger — go home">
          <Image
            src="/heytiger-logo.png"
            alt="Hey Tiger"
            width={120}
            height={40}
            unoptimized
            style={{
              height: '36px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
              opacity: 0.7,
            }}
          />
        </Link>
      </motion.div>

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.5))' }} />
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          letterSpacing: '0.44em',
          color: 'rgba(201,162,39,0.8)',
          fontWeight: 700,
        }}>
          404
        </span>
        <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, rgba(201,162,39,0.5), transparent)' }} />
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: 'clamp(52px, 8vw, 124px)',
          lineHeight: 0.88,
          letterSpacing: '-0.04em',
          color: 'var(--clr-cream)',
          margin: '0 0 28px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        This isn&apos;t<br />
        <span style={{ color: '#c8281a' }}>on the menu.</span>
      </motion.h1>

      {/* Body */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(16px, 1.6vw, 20px)',
          lineHeight: 1.7,
          color: 'rgba(245,239,224,0.48)',
          maxWidth: '480px',
          marginBottom: 'clamp(40px, 5vw, 56px)',
          position: 'relative',
          zIndex: 1,
          letterSpacing: '0.01em',
        }}
      >
        The page you&apos;re looking for wandered off after last call.
        <br />
        Let&apos;s get you somewhere warmer.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.42 }}
        style={{
          display: 'flex',
          gap: '14px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '0.26em',
            color: 'var(--clr-void)',
            backgroundColor: '#faaf3f',
            padding: '15px 32px',
            borderRadius: '40px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            minHeight: '44px',
            transition: 'background 0.3s, color 0.3s, box-shadow 0.3s',
            boxShadow: '0 6px 20px rgba(201,162,39,0.36)',
          }}
          onMouseEnter={(e) => { const el = e.currentTarget; el.style.backgroundColor = '#0d0d0d'; el.style.color = '#faaf3f'; el.style.boxShadow = '0 0 0 1px rgba(250,175,63,0.5), 0 8px 24px rgba(0,0,0,0.4)'; }}
          onMouseLeave={(e) => { const el = e.currentTarget; el.style.backgroundColor = '#faaf3f'; el.style.color = 'var(--clr-void)'; el.style.boxShadow = '0 6px 20px rgba(201,162,39,0.36)'; }}
        >
          TAKE ME HOME →
        </Link>

        <Link
          href="/menu"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: 'rgba(245,239,224,0.75)',
            backgroundColor: 'transparent',
            border: '1px solid rgba(245,239,224,0.2)',
            padding: '15px 28px',
            borderRadius: '40px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            minHeight: '44px',
            transition: 'border-color 0.25s, color 0.25s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(201,162,39,0.5)'; e.currentTarget.style.color = '#faaf3f'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(245,239,224,0.2)'; e.currentTarget.style.color = 'rgba(245,239,224,0.75)'; }}
        >
          READ THE MENU
        </Link>
      </motion.div>

      {/* Japanese footnote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        lang="ja"
        style={{
          position: 'absolute',
          bottom: 'clamp(28px, 4vw, 48px)',
          fontFamily: 'var(--font-jp)',
          fontSize: '12px',
          letterSpacing: '0.22em',
          color: 'rgba(245,239,224,0.18)',
          zIndex: 1,
          userSelect: 'none',
        }}
      >
        迷子になった — でも、おいトラ
      </motion.p>
    </main>
  );
}
