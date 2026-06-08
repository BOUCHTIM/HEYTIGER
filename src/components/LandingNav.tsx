'use client';

import Image from 'next/image';

export default function LandingNav({
  onReserve,
  onScrollTo,
}: {
  onReserve: () => void;
  onScrollTo: (id: string) => void;
}) {
  return (
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
          width={280}
          height={85}
          priority
          unoptimized
          style={{
            height: '72px',
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </button>

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
    </header>
  );
}

