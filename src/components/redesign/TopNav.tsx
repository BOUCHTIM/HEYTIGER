'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV, RESERVE_NAV, HERO } from '@/data/site';
import { Logo } from './primitives';
import { useSweep } from './PageSweep';

export default function TopNav({ onReserve }: { onReserve: () => void }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const sweep = useSweep();

  // escape closes the overlay; lock scroll while open (links close it on click)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open]);

  const isCurrent = (href: string) => (href === '/menu' ? pathname === '/menu' : false);

  return (
    <>
      <header className="rd-nav">
        <Logo />
        <ul className="rd-nav__links">
          {NAV.map(item => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="rd-nav__link"
                aria-current={isCurrent(item.href) ? 'page' : undefined}
                onClick={e => sweep(e, item.href, item.label, item.jp)}
              >
                <span className="rd-jp" lang="ja">{item.jp}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <button type="button" className="rd-nav__reserve" onClick={onReserve}>
          <span className="rd-jp" lang="ja">{RESERVE_NAV.jp}</span>
          <span>{RESERVE_NAV.label}</span>
        </button>
        <button
          type="button"
          className="rd-nav__burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="rd-overlay"
          onClick={() => setOpen(v => !v)}
        >
          <span /><span /><span />
        </button>
      </header>

      {open && (
        <nav id="rd-overlay" className="rd-overlay" aria-label="Site">
          <ul className="rd-overlay__list">
            {NAV.map(item => (
              <li key={item.id}>
                <Link href={item.href} className="rd-overlay__link" onClick={e => { setOpen(false); sweep(e, item.href, item.label, item.jp); }}>
                  <span className="rd-jp" lang="ja">{item.jp}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="rd-overlay__foot">
            <button
              type="button"
              className="rd-overlay__link rd-overlay__reserve"
              onClick={() => { setOpen(false); onReserve(); }}
            >
              <span className="rd-jp" lang="ja">{HERO.jpRail}</span>
              <span>{RESERVE_NAV.label}</span>
            </button>
          </div>
        </nav>
      )}
    </>
  );
}
