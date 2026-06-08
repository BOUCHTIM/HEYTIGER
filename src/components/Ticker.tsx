'use client';

import Image from 'next/image';

export default function Ticker({
  backgroundColor,
}: {
  backgroundColor?: string;
  /** kept for API compatibility — ticker is always the dark, white-on-plum treatment now */
  variant?: 'light' | 'dark';
}) {
  const items: string[] = [
    'HEY, TIGER',
    '__LOGO__',
    'おいトラ',
    'OPEN TUE–SUN',
    'RAAAAAAR CULTURE',
    'ヘイ、タイガー',
    'MOTOR CITY DUBAI',
    '47 SAKE LABELS',
    'ROOFTOP OPEN NIGHTLY',
    'BAR & RESTAURANT',
    'おいトラ',
    'BRUNCH SAT & SUN',
  ];

  const repeated = [...items, ...items]; // double for seamless loop

  return (
    <div
      aria-hidden="true"
      style={{
        backgroundColor: backgroundColor ?? 'var(--clr-red)',
        overflow: 'hidden',
        padding: '14px 0',
        borderTop: '1px solid rgba(18,13,20,0.22)',
        borderBottom: '1px solid rgba(18,13,20,0.22)',
      }}
    >
      <div className="ticker-track">
        {repeated.map((item, i) => {
          if (item === '__LOGO__') {
            return (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', padding: '0 36px' }}>
                <Image
                  src="/heytiger-logo.png"
                  alt=""
                  width={120}
                  height={34}
                  unoptimized
                  style={{ height: '22px', width: 'auto', objectFit: 'contain', filter: 'brightness(0)', opacity: 0.9 }}
                />
                <span style={{ marginLeft: '36px', opacity: 0.4, fontSize: '8px', color: 'rgba(18,13,20,0.5)' }}>◆</span>
              </span>
            );
          }
          const isJp = /[぀-ヿ㐀-鿿]/.test(item);
          return (
            <span
              key={i}
              lang={isJp ? 'ja' : undefined}
              style={{
                fontFamily: isJp ? 'var(--font-jp)' : 'var(--font-body)',
                fontSize: isJp ? '16px' : '13px',
                letterSpacing: isJp ? '0.18em' : '0.32em',
                color: 'var(--clr-void)',
                fontWeight: 700,
                padding: '0 36px',
                whiteSpace: 'nowrap',
              }}
            >
              {item}
              <span style={{ marginLeft: '36px', opacity: 0.4, fontSize: '8px', color: 'rgba(18,13,20,0.5)' }}>◆</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
