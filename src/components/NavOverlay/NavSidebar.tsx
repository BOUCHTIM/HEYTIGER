'use client';

import { useEffect, useState } from 'react';

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Hey+Tiger+Motor+City+Dubai';

export default function NavSidebar() {
  const [isOpenNow, setIsOpenNow] = useState<boolean | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    setIsOpenNow(hour >= 12 || hour < 2);
  }, []);

  return (
    <div className="nav-overlay-sidebar">
      <div>
        <span
          className={`nav-overlay-status-dot ${isOpenNow ? 'is-open' : 'is-closed'}`}
          aria-hidden="true"
        />
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-micro)',
            letterSpacing: '0.3em',
            color: 'var(--clr-cream)',
            textTransform: 'uppercase',
          }}
        >
          {isOpenNow === null ? '· · ·' : isOpenNow ? 'OPEN NOW · UNTIL 2AM' : 'CLOSED · OPENS 12PM'}
        </span>
      </div>

      <div>
        <p className="nav-overlay-sidebar-label">FIND US 場所</p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-body)', color: 'var(--clr-cream)' }}>
          Motor City, Dubai
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'rgba(240,235,216,0.4)', marginTop: '4px' }}>
          Al Khail Road, Exit 37
        </p>
        <a href={MAPS_URL} target="_blank" rel="noreferrer" className="nav-overlay-directions">
          GET DIRECTIONS →
        </a>
      </div>

      <div>
        <p className="nav-overlay-sidebar-label">FOLLOW フォロー</p>
        <a href="https://instagram.com/heytigerdubai" target="_blank" rel="noreferrer" className="nav-overlay-social-link">
          INSTAGRAM <span className="arrow" aria-hidden="true">→</span>
        </a>
        <a href="https://tiktok.com/@heytigerdubai" target="_blank" rel="noreferrer" className="nav-overlay-social-link">
          TIKTOK <span className="arrow" aria-hidden="true">→</span>
        </a>
        <a href={MAPS_URL} target="_blank" rel="noreferrer" className="nav-overlay-social-link">
          GOOGLE <span className="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
