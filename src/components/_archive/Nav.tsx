// ARCHIVED — possibly used on secondary pages.
// Confirm usage before restoring. Do not import from active components.
// Archived: 2026-05-31
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type SectionId = 'story' | 'space' | 'menu' | 'experience' | 'who' | 'visit';

const links: Array<{ label: string; section?: SectionId; href?: string; reserve?: true }> = [
  { label: 'ABOUT',   section: 'story'      },
  { label: 'MENU',    href:    '/menu'       },
  { label: 'SPACES',  section: 'space'      },
  { label: 'BOOK',    reserve: true         },
  { label: 'CONTACT', section: 'visit'      },
];

export default function Nav({
  hideCta = false,
  onNavigate,
  onReserve,
}: {
  hideCta?: boolean;
  onNavigate?: (id: SectionId) => void;
  onReserve?: () => void;
}) {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [headerFade, setHeaderFade] = useState(1);
  const drawerRef = useRef<HTMLElement>(null);

  const handleLink = (l: typeof links[number], close = false) => {
    if (close) setMenuOpen(false);
    if (l.section)       { onNavigate?.(l.section); return; }
    if (l.reserve)       { onReserve?.();            return; }
    if (l.href)          { window.location.assign(l.href); }
  };

  // Focus trap for the mobile drawer — keeps Tab cycling inside the panel
  useEffect(() => {
    if (!menuOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    // Focus first element when drawer opens
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenuOpen(false); return; }
      if (e.key !== 'Tab') return;
      if (focusable.length === 0) { e.preventDefault(); return; }
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus(); }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      const vh = window.innerHeight || 800;
      const fadeStart = vh * 0.55;
      const fadeEnd = vh * 0.95;
      const t = Math.min(1, Math.max(0, (y - fadeStart) / (fadeEnd - fadeStart)));
      setHeaderFade(1 - t);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        role="banner"
        className="ht-nav-header"
        // When the nav fades to transparent during hero scroll, hide it from
        // both pointer events AND keyboard/AT — prevents invisible tab stops.
        aria-hidden={headerFade < 0.08 ? true : undefined}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 900,
          // Responsive height — controlled via media query below
          height: 'var(--ht-nav-h, 92px)',
          paddingTop: 'env(safe-area-inset-top)',  // iOS notch
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 'clamp(16px, 4vw, 40px)',
          paddingRight: 'clamp(16px, 4vw, 40px)',
          justifyContent: 'space-between',
          transition: 'background-color 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease',
          backgroundColor: scrolled ? 'rgba(13,8,11,0.82)' : '#d52f19',
          backdropFilter: scrolled ? 'blur(22px) saturate(1.15)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(22px) saturate(1.15)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,162,39,0.22)' : 'none',
          opacity: headerFade,
          pointerEvents: headerFade < 0.08 ? 'none' : 'auto',
          // visibility:hidden removes from tab order — prevents ghosted keyboard trap
          visibility: headerFade < 0.08 ? 'hidden' : 'visible',
        }}
      >
        {/* Logo + live open status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <Link href="/" aria-label="Hey Tiger — home" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', minHeight: '44px', minWidth: '44px' }}>
            <LogoLockup />
          </Link>
          <OpenStatus />
        </div>

        {/* Desktop nav */}
        <nav aria-label="Primary" style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="hidden-mobile">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => handleLink(l)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                letterSpacing: '0.24em',
                color: 'rgba(245,239,224,0.82)',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid transparent',
                paddingBottom: '2px',
                transition: 'color 0.25s, border-color 0.25s',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '44px',
                paddingInline: '4px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#faaf3f'; e.currentTarget.style.borderBottomColor = 'rgba(250,175,63,0.55)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(245,239,224,0.82)'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Desktop CTA — hidden when menu index is shown (hideCta) */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', visibility: hideCta ? 'hidden' : 'visible' }} className="hidden-mobile">
          <button
            onClick={() => onReserve?.()}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              letterSpacing: '0.26em',
              fontWeight: 800,
              color: '#000000',
              background: '#e2d5b5',
              border: 'none',
              padding: '13px 26px',
              borderRadius: '40px',
              cursor: 'pointer',
              transition: 'background 0.3s, transform 0.2s, box-shadow 0.3s',
              boxShadow: '0 4px 16px rgba(201,162,39,0.38)',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#0d0d0d'; e.currentTarget.style.color = '#faaf3f'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(250,175,63,0.55), 0 8px 24px rgba(0,0,0,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#e2d5b5'; e.currentTarget.style.color = '#000000'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,162,39,0.38)'; e.currentTarget.style.transform = 'none'; }}
          >
            TAKE A SEAT
          </button>
        </div>

        {/* Mobile burger — 44x44 touch target */}
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-drawer"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '10px',
            display: 'none',
            width: '44px',
            height: '44px',
            alignItems: 'center',
            justifyContent: 'center',
            color: scrolled ? '#F5EFE0' : '#e8331b',
            transition: 'color 0.3s',
          }}
          className="show-mobile"
        >
          <BurgerIcon open={menuOpen} />
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
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(21,13,17,0.85)',
                zIndex: 850,
                backdropFilter: 'blur(4px)',
              }}
            />
            <motion.nav
              id="mobile-drawer"
              key="drawer"
              ref={drawerRef}
              aria-label="Mobile navigation"
              role="dialog"
              aria-modal="true"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              style={{
                position: 'fixed',
                top: 0, right: 0, bottom: 0,
                // Phones: full-width drawer; tablets+: 320px panel
                width: 'min(88vw, 360px)',
                paddingTop: 'calc(96px + env(safe-area-inset-top))',
                paddingBottom: 'calc(40px + env(safe-area-inset-bottom))',
                paddingLeft: 'clamp(24px, 5vw, 36px)',
                paddingRight: 'clamp(24px, 5vw, 36px)',
                background: 'var(--clr-cream-2, #e0d3b4)',
                zIndex: 860,
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                borderLeft: '1px solid rgba(13,13,13,0.14)',
                color: 'var(--clr-void)',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginLeft: 'calc(-1 * clamp(24px, 5vw, 36px))',
                  marginBottom: '10px',
                }}
              >
                <div style={{ position: 'relative', width: 'min(92vw, 340px)', height: '64px' }}>
                  <Image src="/heytiger-logo.png" alt="" fill unoptimized sizes="(max-width: 480px) 92vw, 340px" style={{ objectFit: 'contain', filter: 'brightness(0) saturate(100%)' }} />
                </div>
              </div>
              <span lang="ja" style={{ fontFamily: 'var(--font-jp)', fontSize: '16px', color: 'var(--clr-red)', letterSpacing: '0.15em', marginBottom: '32px', opacity: 0.9 }}>
                おいトラ
              </span>
              {links.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.35 }}
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid rgba(13,13,13,0.12)',
                  }}
                >
                  <button
                    onClick={() => handleLink(l, true)}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(30px, 8.8vw, 44px)',
                      letterSpacing: '0.06em',
                      color: 'var(--clr-void)',
                      transition: 'color 0.2s',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--clr-red)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--clr-void)')}
                  >
                    {l.label}
                  </button>
                </motion.div>
              ))}
              {!hideCta && (
                <button
                  onClick={() => { setMenuOpen(false); onReserve?.(); }}
                  style={{
                    marginTop: '32px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    letterSpacing: '0.18em',
                    fontWeight: 800,
                    color: 'var(--clr-void)',
                    background: 'var(--clr-amber)',
                    border: 'none',
                    padding: '18px 28px',
                    borderRadius: '40px',
                    textAlign: 'center',
                    boxShadow: '0 6px 18px rgba(250,175,63,0.32)',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  TAKE A SEAT
                </button>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <style>{`
        :root { --ht-nav-h: 92px; }
        .hidden-mobile { display: flex; }
        .show-mobile   { display: none; }
        .ht-nav-header img { transition: height 0.3s ease; }
        @media (max-width: 768px) {
          :root { --ht-nav-h: 72px; }
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
          .ht-nav-header img { height: 52px !important; }
        }
        @media (max-width: 480px) {
          :root { --ht-nav-h: 64px; }
          .ht-nav-header img { height: 46px !important; }
        }
      `}</style>
    </>
  );
}

function LogoLockup() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', lineHeight: 0 }}>
      <Image
        src="/heytiger-logo.png"
        alt=""
        aria-hidden="true"
        width={180}
        height={56}
        priority
        unoptimized
        style={{
          height: '56px',
          width: 'auto',
          display: 'block',
          objectFit: 'contain',
          filter: 'brightness(0) invert(1)',
          opacity: 0.96,
        }}
      />
    </span>
  );
}

/* ─── Live "open now" status ─────────────────────────────────────────
   Computes open/closed against the published HOURS table and renders
   a pulsing dot + label.  Hides on small viewports — covered by drawer.
─────────────────────────────────────────────────────────────────── */
function OpenStatus() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  // Mon=1 … Sun=7  ←→  schedule [open, close] in 24h decimal hours; null = closed
  const SCHEDULE: Array<[number, number] | null> = [
    null,           // Sun → replaced below
    null,           // Mon — closed
    [18, 26],       // Tue 6PM → 2AM next day
    [18, 26],       // Wed
    [18, 26],       // Thu
    [18, 26],       // Fri
    [11, 26],       // Sat 11AM → 2AM
    [11, 24],       // Sun 11AM → midnight
  ];

  const day  = now.getDay() === 0 ? 7 : now.getDay(); // 1..7
  const hour = now.getHours() + now.getMinutes() / 60;
  // Roll-over: hours 0..2 belong to *yesterday's* shift
  const yesterday = day === 1 ? 7 : day - 1;
  const { isOpen, closesLabel } = (() => {
    let open = false;
    let closesAt: number | null = null;

    const today = SCHEDULE[day];
    if (today && hour >= today[0] && hour < today[1]) {
      open = true;
      closesAt = today[1];
    } else {
      const prev = SCHEDULE[yesterday];
      if (prev && prev[1] > 24 && hour < prev[1] - 24) {
        open = true;
        closesAt = prev[1];
      }
    }

    const label = closesAt
      ? (() => {
          const h = closesAt > 24 ? closesAt - 24 : closesAt;
          const suffix = h < 12 || h === 24 ? 'AM' : 'PM';
          const display = h === 24 ? 12 : h > 12 ? h - 12 : h;
          return `CLOSES ${display}${suffix}`;
        })()
      : 'CLOSED';

    return { isOpen: open, closesLabel: label };
  })();

  return (
    <Link
      href="/availability"
      aria-label={isOpen ? `Open now — ${closesLabel}. View availability.` : 'Closed now. View availability.'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '56px',
        height: '56px',
        borderRadius: '999px',
        background: 'transparent',
        border: '2px solid #D93D1A',
        fontFamily: 'var(--font-body)',
        fontSize: '10px',
        fontWeight: 900,
        letterSpacing: '0.18em',
        color: '#D93D1A',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        cursor: 'pointer',
        transform: 'rotate(-10deg)',
      }}
      className="hidden-mobile"
    >
      <motion.span
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          display: 'grid',
          placeItems: 'center',
          width: '46px',
          height: '46px',
          borderRadius: '999px',
          border: `1px solid ${isOpen ? 'rgba(217,61,26,0.75)' : 'rgba(217,61,26,0.45)'}`,
          textAlign: 'center',
          lineHeight: 1.05,
          textTransform: 'uppercase',
        }}
      >
        <span style={{ display: 'block' }}>{isOpen ? 'OPEN' : 'CLOSED'}</span>
        <span style={{ display: 'block', fontSize: '9px', letterSpacing: '0.14em' }}>
          {isOpen ? closesLabel : 'SEE HOURS'}
        </span>
      </motion.span>
    </Link>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '24px',
        height: '24px',
        position: 'relative',
        color: '#000000',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          left: '3px',
          right: '3px',
          top: '6px',
          height: '2px',
          borderRadius: '999px',
          background: 'currentColor',
          transformOrigin: '50% 50%',
        }}
        animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
      />
      <motion.div
        style={{
          position: 'absolute',
          left: '3px',
          right: '3px',
          top: '12px',
          height: '2px',
          borderRadius: '999px',
          background: 'currentColor',
        }}
        animate={open ? { opacity: 0 } : { opacity: 1 }}
      />
      <motion.div
        style={{
          position: 'absolute',
          left: '3px',
          right: '3px',
          top: '18px',
          height: '2px',
          borderRadius: '999px',
          background: 'currentColor',
          transformOrigin: '50% 50%',
        }}
        animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
      />
    </div>
  );
}
