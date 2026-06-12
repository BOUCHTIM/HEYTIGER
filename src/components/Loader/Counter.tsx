'use client';

import { useEffect, useRef, useState } from 'react';

interface CounterProps {
  /** Total count duration in ms (Phase 1). */
  durationMs?: number;
  /** Skip the rAF run and snap to 100 immediately. */
  reduceMotion?: boolean;
  /** Fires once when the count reaches 100. */
  onComplete?: () => void;
}

/**
 * easeOutExpo — the count races up in the first stretch, then settles into 100
 * with a long, dramatic tail (matches the "fast 0–80%, slow 80–100%" brief).
 */
const easeOutExpo = (t: number): number => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Phase 1 progress indicator — a rAF-driven counter (never a CSS animation, so
 * the value is always a real integer we can read). Fixed 3-char tabular box ⇒
 * zero layout shift as the digits grow 1 → 2 → 3 wide.
 */
export default function Counter({ durationMs = 1800, reduceMotion = false, onComplete }: CounterProps) {
  const [value, setValue] = useState(0);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (reduceMotion) {
      setValue(100);
      if (!doneRef.current) {
        doneRef.current = true;
        onCompleteRef.current?.();
      }
      return;
    }

    let raf = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const p = Math.min(1, (now - start) / durationMs);
      setValue(Math.round(easeOutExpo(p) * 100));

      if (p >= 1) {
        if (!doneRef.current) {
          doneRef.current = true;
          onCompleteRef.current?.();
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, reduceMotion]);

  return (
    <span
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 900,
        fontSize: 'clamp(72px, 15vw, 260px)',
        lineHeight: 1,
        color: '#FFFFFF',
        fontVariantNumeric: 'tabular-nums',
        width: '3ch',
        textAlign: 'center',
        display: 'inline-block',
        letterSpacing: '0.01em',
      }}
    >
      {value}
    </span>
  );
}
