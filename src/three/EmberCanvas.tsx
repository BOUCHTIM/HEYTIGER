'use client';

import { Canvas } from '@react-three/fiber';
import EmberField, { type EmberFieldProps } from './scenes/EmberField';
import { useAdaptiveQuality, QUALITY_PARTICLES, QUALITY_DPR } from './hooks/useAdaptiveQuality';

export interface EmberCanvasProps extends Omit<EmberFieldProps, 'count'> {
  /** multiplier applied to the tier's base particle count (default 1) */
  density?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Drop-in <canvas> layer rendering the EmberField. Returns null on
 * prefers-reduced-motion / no-WebGL / before quality is determined — caller
 * should dynamic-import this with `ssr: false` to keep it out of the
 * server bundle and avoid hydration mismatches.
 */
export default function EmberCanvas({ density = 1, className, style, ...field }: EmberCanvasProps) {
  const tier = useAdaptiveQuality();

  if (tier === 'off') return null;

  const count = Math.round(QUALITY_PARTICLES[tier] * density);
  if (count <= 0) return null;

  return (
    <Canvas
      className={className}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...style }}
      dpr={QUALITY_DPR[tier]}
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <EmberField count={count} {...field} />
    </Canvas>
  );
}
