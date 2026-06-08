'use client';

/**
 * GlobalGrain — a fine, even film/paper grain over the whole page.
 *
 * Uses an SVG fractal-noise texture (high frequency = fine grain, like real
 * film/paper) with `mix-blend-mode: overlay`. Overlay is NEUTRAL at mid-grey,
 * so it does NOT add a flat grey veil the way `normal` blend does — colors
 * underneath stay fully saturated (and read a touch punchier). The grain is
 * the same fine texture everywhere.
 *
 * Fixed, pointer-events:none, below the nav (z 950) and modals (z 1000).
 */

const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='2' stitchTiles='stitch' result='n'/%3E%3CfeColorMatrix in='n' type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0' intercept='1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")";

export default function GlobalGrain() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        pointerEvents: 'none',
        backgroundImage: GRAIN_SVG,
        backgroundSize: '220px 220px',
        backgroundRepeat: 'repeat',
        mixBlendMode: 'overlay',
        opacity: 0.55,
      }}
    />
  );
}
