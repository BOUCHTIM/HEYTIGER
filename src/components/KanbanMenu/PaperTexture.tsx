/**
 * PaperTextureFilter — an SVG fractal-noise filter injected into the DOM once at
 * the page root. Cards reference it via `filter: url(#paper-texture)` on a
 * dedicated colour layer (not the text), giving a tactile paper grain without
 * harming legibility. No image files.
 */
export default function PaperTextureFilter() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute', pointerEvents: 'none' }}>
      <defs>
        <filter id="paper-texture" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
          <feBlend in="SourceGraphic" in2="grey" mode="multiply" result="blend" />
          <feComponentTransfer in="blend">
            <feFuncA type="linear" slope="1" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}
