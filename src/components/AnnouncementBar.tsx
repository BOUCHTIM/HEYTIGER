'use client';

const ITEMS = [
  { type: 'logo',  text: 'HEY, TIGER' },
  { type: 'dot' },
  { type: 'label', text: 'MOTOR CITY DUBAI' },
  { type: 'dot' },
  { type: 'jp',    text: 'おいトラ' },
  { type: 'dot' },
  { type: 'label', text: 'OPEN TUE–SUN' },
  { type: 'dot' },
  { type: 'label', text: '47 SAKE LABELS' },
  { type: 'dot' },
  { type: 'label', text: 'BRUNCH SAT & SUN FROM 11AM' },
  { type: 'dot' },
  { type: 'label', text: 'RAAAAAAR CULTURE' },
  { type: 'dot' },
  { type: 'label', text: 'BOOK A TABLE' },
  { type: 'dot' },
  { type: 'label', text: 'ROOFTOP OPEN NIGHTLY' },
  { type: 'dot' },
];

function Strip() {
  return (
    <>
      {ITEMS.map((item, i) => {
        if (item.type === 'dot') return (
          <span key={i} aria-hidden="true" style={{
            color: 'rgba(18,13,20,0.5)', fontSize: '7px',
            flexShrink: 0, margin: '0 10px',
          }}>◆</span>
        );
        if (item.type === 'logo') return (
          <span key={i} style={{
            fontFamily: 'var(--font-display)', fontSize: '18px',
            fontWeight: 900, letterSpacing: '0.26em',
            color: 'var(--clr-void)', whiteSpace: 'nowrap', flexShrink: 0,
          }}>{item.text}</span>
        );
        if (item.type === 'jp') return (
          <span key={i} lang="ja" style={{
            fontFamily: 'var(--font-jp)', fontSize: '17px',
            letterSpacing: '0.18em', color: 'var(--clr-void)',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>{item.text}</span>
        );
        return (
          <span key={i} style={{
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)',
            fontWeight: 900, letterSpacing: 'var(--tracking-ultra)',
            color: 'var(--clr-void)', whiteSpace: 'nowrap', flexShrink: 0,
          }}>{item.text}</span>
        );
      })}
    </>
  );
}

export default function AnnouncementBar() {
  return (
    <div
      role="contentinfo"
      aria-label="Hey Tiger — opening announcement ticker"
      style={{
        position: 'relative',
        width: '100%',
        height: '50px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--clr-red)',
        borderTop: '2px solid var(--clr-void)',
      }}
    >
      {/* Screen-reader static summary — ticker track is aria-hidden */}
      <span className="sr-only">
        Hey Tiger — Motor City Dubai. Open Tuesday to Sunday. Rooftop open nightly. Brunch Saturday and Sunday from 11AM.
      </span>
      <div
        aria-hidden="true"
        style={{
          display: 'flex',
          alignItems: 'center',
          animation: 'ht-footer-marquee 36s linear infinite',
          willChange: 'transform',
          flexShrink: 0,
        }}
      >
        <Strip /><Strip /><Strip /><Strip />
      </div>

      <style>{`
        @keyframes ht-footer-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes ht-footer-marquee { 0%, 100% { transform: none; } }
        }
      `}</style>
    </div>
  );
}
