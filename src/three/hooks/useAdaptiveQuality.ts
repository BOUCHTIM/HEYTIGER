'use client';

import { useEffect, useState } from 'react';

export type QualityTier = 'off' | 'low' | 'high';

/**
 * Adaptive quality tier for GPU-driven decoration:
 * - 'off'  — prefers-reduced-motion, or no WebGL2 support → don't mount the canvas
 * - 'low'  — mobile / narrow viewport → small particle count, capped dpr
 * - 'high' — desktop → full particle count, native dpr (capped at 2)
 */
export function useAdaptiveQuality(): QualityTier {
  const [tier, setTier] = useState<QualityTier>('off');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTier('off');
      return;
    }

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!gl) {
      setTier('off');
      return;
    }

    const mql = window.matchMedia('(min-width: 768px)');
    const sync = () => setTier(mql.matches ? 'high' : 'low');
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, []);

  return tier;
}

export const QUALITY_PARTICLES: Record<QualityTier, number> = {
  off: 0,
  low: 80,
  high: 220,
};

export const QUALITY_DPR: Record<QualityTier, [number, number]> = {
  off: [1, 1],
  low: [1, 1.5],
  high: [1, 2],
};
