// ARCHIVED — possibly used on secondary pages.
// Confirm usage before restoring. Do not import from active components.
// Archived: 2026-05-31
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const NAV_LINKS = [
  { label: 'THE STORY',  id: 'story'   },
  { label: 'THE MENU',   id: 'menu'    },
  { label: 'THE SPACE',  id: 'space'   },
  { label: 'FIND US',    id: 'contact' },
];

export default function NewNav({
  onReserve,
  onScrollTo,
}: {
  onReserve: () => void;
  onScrollTo: (id: string) => void;
}) {
  const [pastHero,  setPastHero]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [active,    setActive]    = useState<string | null>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const heroEl = document.getElementById('hero');
      const heroH  = heroEl ? heroEl.offsetHeight : window.innerHeight;
      setPastHero(window.scrollY >= heroH * 0.85);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track which section is in view
  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.id).concat(['hero']);
    const observers = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { threshold: 0.3 }
      );
      io.observe(el);
      return io;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Focus trap
  useEffect(() => {
    if (!menuOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const focusable = drawer.querySelectorAll<HTMLElement>('button, a[href]');
    focusable[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenuOpen(false); return; }
      if (e.key !== 'Tab') return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const handleNav = (id: string) => {
    setMenuOpen(false);
    onScrollTo(id);
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 900,
          height: 'var(--ht-nav-h, 80px)',
          paddingTop: 'env(safe-area-inset-top)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 'clamp(20px, 5vw, 56px)',
          paddingRight: 'clamp(20px, 5vw, 56px)',
          justifyContent: 'space-between',
          transition: 'background 0.35s ease, box-shadow 0.35s ease, opacity 0.45s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)',
          background: 'rgba(27, 14, 32, 0.94)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow: '0 1px 0 rgba(197,72,52,0.2)',
          opacity: pastHero ? 1 : 0,
          transform: pastHero ? 'translateY(0)' : 'translateY(-100%)',
          pointerEvents: pastHero ? 'auto' : 'none',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => onScrollTo('hero')}
          aria-label="Hey Tiger — back to top"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', minHeight: '44px' }}
        >
          <Image
            src="/heytiger-logo.png"
            alt="Hey Tiger"
            width={160}
            height={50}
            priority
            unoptimized
            style={{ height: 'clamp(44px, 4.5vw, 60px)', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
          />
        </button>

        {/* Desktop links */}
        <nav aria-label="Primary" style={{ display: 'flex', gap: '36px', alignItems: 'center' }} className="ht-desktop-nav">
          {NAV_LINKS.map(l => (
            <button
              key={l.id}
              onClick={() => handleNav(l.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: '11px',
                fontWeight: 700, letterSpacing: '0.32em',
                color: active === l.id ? '#C54834' : 'rgba(255,204,0,0.72)',
                paddingBottom: '6px',
                transition: 'color 0.22s',
                minHeight: '44px',
                position: 'relative',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#C54834'; }}
              onMouseLeave={e => { e.currentTarget.style.color = active === l.id ? '#C54834' : 'rgba(255,204,0,0.72)'; }}
            >
              {l.label}
              {active === l.id && (
                <motion.span
                  layoutId="nav-underline"
                  style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: '2px',
                    background: '#C54834',
                    borderRadius: '1px',
                    boxShadow: '0 0 6px rgba(197,72,52,0.7)',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <button
          onClick={onReserve}
          className="ht-desktop-nav"
          style={{
            fontFamily: 'var(--font-body)', fontSize: '11px',
            fontWeight: 800, letterSpacing: '0.3em',
            color: '#1b0e20', background: '#C54834',
            border: 'none', padding: '13px 28px', borderRadius: '40px',
            cursor: 'pointer', minHeight: '44px',
            transition: 'background 0.2s, transform 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#A83828'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#C54834'; e.currentTarget.style.transform = 'none'; }}
        >
          BOOK A TABLE
        </button>

        {/* Mobile burger */}
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
          className="ht-mobile-nav"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            width: '44px', height: '44px', display: 'none',
            alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '5px',
          }}
        >
          <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }} style={{ display: 'block', width: '22px', height: '2px', background: '#ede7c9', borderRadius: '1px', transformOrigin: 'center' }} />
          <motion.span animate={{ opacity: menuOpen ? 0 : 1 }} style={{ display: 'block', width: '22px', height: '2px', background: '#ede7c9', borderRadius: '1px' }} />
          <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }} style={{ display: 'block', width: '22px', height: '2px', background: '#ede7c9', borderRadius: '1px', transformOrigin: 'center' }} />
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(20,20,20,0.88)', zIndex: 850, backdropFilter: 'blur(4px)' }}
            />
            <motion.nav
              key="drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(85vw, 340px)',
                background: '#C54834',
                zIndex: 860, display: 'flex', flexDirection: 'column',
                paddingTop: 'calc(80px + env(safe-area-inset-top))',
                paddingBottom: 'calc(40px + env(safe-area-inset-bottom))',
                paddingLeft: '32px', paddingRight: '32px',
              }}
            >
              <span lang="ja" style={{ fontFamily: 'var(--font-jp)', fontSize: '28px', color: 'rgba(237,231,201,0.55)', letterSpacing: '0.2em', marginBottom: '40px' }}>
                おいトラ
              </span>
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.32 }}
                  style={{ borderBottom: '1px solid rgba(237,231,201,0.2)', paddingBlock: '14px' }}
                >
                  <button
                    onClick={() => handleNav(l.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 9vw, 40px)',
                      fontWeight: 900, color: '#ede7c9', letterSpacing: '-0.02em',
                      display: 'block', width: '100%', textAlign: 'left',
                    }}
                  >
                    {l.label}
                  </button>
                </motion.div>
              ))}
              <button
                onClick={() => { setMenuOpen(false); onReserve(); }}
                style={{
                  marginTop: '36px', fontFamily: 'var(--font-body)', fontSize: '13px',
                  fontWeight: 800, letterSpacing: '0.28em', color: '#1b0e20',
                  background: '#C54834', border: 'none', padding: '18px 28px',
                  borderRadius: '40px', cursor: 'pointer', textAlign: 'center',
                }}
              >
                BOOK A TABLE
              </button>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <style>{`
        :root { --ht-nav-h: 80px; }
        @media (max-width: 768px) {
          :root { --ht-nav-h: 68px; }
          .ht-desktop-nav { display: none !important; }
          .ht-mobile-nav  { display: flex !important; }
        }
      `}</style>
    </>
  );
}
