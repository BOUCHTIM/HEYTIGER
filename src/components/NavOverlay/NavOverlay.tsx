'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import NavItem from './NavItem';
import NavSidebar from './NavSidebar';
import { NAV_LINKS } from '@/constants/navLinks';

const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='2' stitchTiles='stitch' result='n'/%3E%3CfeColorMatrix in='n' type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0' intercept='1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")";

const wipeVariants: Variants = {
  hidden: { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
  visible: { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
  exit: { clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' },
};

interface NavOverlayProps {
  onClose: () => void;
}

export default function NavOverlay({ onClose }: NavOverlayProps) {
  const prefersReducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const links = panelRef.current?.querySelectorAll<HTMLElement>('a[href]');
    links?.[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !links?.length) return;
      const first = links[0];
      const last = links[links.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <motion.div
      id="nav-overlay-panel"
      ref={panelRef}
      className="nav-overlay-panel"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      variants={prefersReducedMotion ? undefined : wipeVariants}
      initial={prefersReducedMotion ? undefined : 'hidden'}
      animate={prefersReducedMotion ? undefined : 'visible'}
      exit={prefersReducedMotion ? undefined : 'exit'}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
    >
      <span className="nav-overlay-kanji" aria-hidden="true">虎</span>
      <div
        className="nav-overlay-grain"
        aria-hidden="true"
        style={{ backgroundImage: GRAIN_SVG, backgroundSize: '220px 220px', backgroundRepeat: 'repeat' }}
      />

      <div className="nav-overlay-content">
        <nav className="nav-overlay-links" aria-label="Primary">
          {NAV_LINKS.map((link, i) => (
            <NavItem key={link.id} link={link} index={i} reduceMotion={!!prefersReducedMotion} onNavigate={onClose} />
          ))}
        </nav>

        <div className="nav-overlay-divider" aria-hidden="true" />

        <NavSidebar />
      </div>

      <div className="nav-overlay-footer">
        <span>ヘイ・タイガー © 2024 BRASS MONKEY HOSPITALITY</span>
        <span>RAAAAAAR CULTURE 🐯</span>
      </div>
    </motion.div>
  );
}
