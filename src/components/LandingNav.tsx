'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const LINKS = [
  { label: 'STORY', id: 'story', jp: '物語', flickerDelay: '0.3s' },
  { label: 'MENU', id: 'menu', jp: '食', flickerDelay: '0.6s' },
  { label: 'SPACES', id: 'space', jp: '空間', flickerDelay: '0.9s' },
  { label: 'FIND US', id: 'contact', jp: '来る', flickerDelay: '1.2s' },
];

export default function LandingNav({
  onReserve,
  onScrollTo,
}: {
  onReserve: () => void;
  onScrollTo: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [menuOpen]);

  // Fix 3 — active section indicator via IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[id], footer[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => { setMenuOpen(false); onScrollTo(id); };

  return (
    <>
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 950,
        paddingTop: 'env(safe-area-inset-top)',
        height: '88px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: 'clamp(16px, 4vw, 40px)',
        background: 'rgba(10, 7, 13, 0.28)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(245,239,224,0.10)',
      }}
      aria-label="Landing navigation"
    >
      <button
        onClick={() => onScrollTo('hero')}
        aria-label="Hey Tiger — back to top"
        style={{
          background: 'transparent',
          border: 0,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          minHeight: '44px',
          cursor: 'pointer',
        }}
      >
        <Image
          src="/heytiger-logo.png"
          alt="Hey Tiger"
          width={240}
          height={70}
          priority
          unoptimized
          style={{
            height: '58px',
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </button>

      <nav aria-label="Primary" className="ht-landing-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        {LINKS.map((l) => (
          <button
            key={l.label}
            onClick={() => onScrollTo(l.id)}
            className="nav-link"
            aria-current={activeId === l.id ? 'true' : undefined}
            style={{
              background: 'transparent',
              border: 0,
              padding: 0,
              cursor: 'pointer',
              minHeight: '44px',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: 'var(--text-label)',
              letterSpacing: '0.30em',
              textTransform: 'uppercase',
              color: activeId === l.id ? 'var(--clr-red)' : 'var(--clr-cream-70)',
              transition: 'color var(--dur-fast) var(--ease-standard)',
            }}
            onMouseEnter={(e) => {
              if (activeId !== l.id) e.currentTarget.style.color = 'rgba(245,239,224,0.92)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = activeId === l.id ? 'var(--clr-red)' : 'var(--clr-cream-70)';
            }}
          >
            <span>{l.label}</span>
          </button>
        ))}
      </nav>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <button
          onClick={onReserve}
          className="ht-landing-cta"
          style={{
            background: 'var(--clr-red)',
            color: 'var(--clr-void)',
            border: 0,
            borderRadius: 0,
            padding: '12px 18px',
            minHeight: '44px',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-label)',
            fontWeight: 900,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            transition: 'background var(--dur-fast) var(--ease-standard)',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--clr-red-dim)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--clr-red)';
          }}
        >
          BOOK TABLE
        </button>

        {/* Hamburger — mobile only */}
        <button
          type="button"
          className="ht-landing-burger"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          style={{
            display: 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '6px',
            width: '44px',
            height: '44px',
            background: 'transparent',
            border: '1px solid rgba(245,239,224,0.2)',
            borderRadius: 0,
            cursor: 'pointer',
            padding: '0 10px',
          }}
        >
          <span style={{ display: 'block', height: '2px', background: 'var(--clr-cream)', borderRadius: 0 }} />
          <span style={{ display: 'block', height: '2px', background: 'var(--clr-cream)', borderRadius: 0 }} />
          <span style={{ display: 'block', height: '2px', background: 'var(--clr-cream)', borderRadius: 0 }} />
        </button>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .ht-landing-nav-links { display: none !important; }
          .ht-landing-cta { display: none !important; }
          .ht-landing-burger { display: flex !important; }
        }
      `}</style>
    </header>

    {/* ── Mobile full-screen menu (outside header so backdrop-filter doesn't clip it) ── */}
    {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'var(--clr-void)',
            display: 'flex', flexDirection: 'column',
            paddingTop: 'env(safe-area-inset-top)',
          }}
        >
          {/* Bar with logo + close */}
          <div style={{
            height: '88px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingInline: 'clamp(16px, 4vw, 40px)',
            borderBottom: '1px solid var(--border-structural)',
          }}>
            <Image src="/heytiger-logo.png" alt="Hey Tiger" width={200} height={58} unoptimized
              style={{ height: '50px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.92 }} />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              style={{
                width: '44px', height: '44px', background: 'transparent',
                border: '1px solid rgba(245,239,224,0.2)', borderRadius: 0,
                color: 'var(--clr-cream)', fontSize: '20px', cursor: 'pointer', lineHeight: 1,
              }}
            >✕</button>
          </div>

          {/* Links */}
          <nav aria-label="Mobile primary" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(24px, 6vw, 48px)', gap: 'clamp(14px, 3vh, 28px)' }}>
            {LINKS.map((l) => (
              <button
                key={l.label}
                onClick={() => go(l.id)}
                style={{
                  background: 'transparent', border: 0, padding: '8px 0',
                  cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'baseline', gap: '16px',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 900,
                  fontSize: 'clamp(34px, 11vw, 56px)', lineHeight: 1,
                  letterSpacing: 'var(--tracking-tight)', color: 'var(--clr-cream)',
                }}>{l.label}</span>
                <span lang="ja" style={{ fontFamily: 'var(--font-jp)', fontSize: 'clamp(16px, 4vw, 22px)', color: 'var(--clr-red)', fontWeight: 700 }}>{l.jp}</span>
              </button>
            ))}
          </nav>

          {/* Book CTA */}
          <div style={{ padding: 'clamp(20px, 5vw, 40px)', borderTop: '1px solid var(--border-structural)' }}>
            <button
              onClick={() => { setMenuOpen(false); onReserve(); }}
              style={{
                width: '100%', background: 'var(--clr-red)', color: 'var(--clr-void)',
                border: 0, borderRadius: 0, padding: '18px', minHeight: '52px',
                cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)',
                fontWeight: 900, letterSpacing: '0.28em', textTransform: 'uppercase',
              }}
            >BOOK TABLE</button>
            <p lang="ja" style={{ textAlign: 'center', fontFamily: 'var(--font-jp)', fontSize: 'var(--text-body)', color: 'var(--clr-red-80)', margin: '16px 0 0', letterSpacing: '0.1em' }}>おいトラ · RAAAAAAR CULTURE</p>
          </div>
        </div>
      )}
    </>
  );
}

