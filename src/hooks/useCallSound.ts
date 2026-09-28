'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/* Hey Tiger "call to book" sound engine.
   Gesture-gated by design — sounds only fire from user actions (pick up, keypad,
   connect), so browser autoplay policy is never violated. Mute persists. */

const FILES = {
  dialtone: '/audio/dialtone.wav',
  ring: '/audio/ring.wav',
  key: '/audio/key.wav',
  pickup: '/audio/pickup.wav',
  connect: '/audio/connect.wav',
} as const;

export type Sfx = keyof typeof FILES;

const LOOPED: Sfx[] = ['dialtone', 'ring'];
const MUTE_KEY = 'ht_call_muted';

export function useCallSound() {
  const pool = useRef<Partial<Record<Sfx, HTMLAudioElement>>>({});
  // Mute preference is read lazily on the client; SSR renders unmuted and the
  // hook only ever runs inside client-only UI (the call modal), so no mismatch.
  const [muted, setMuted] = useState(() => {
    if (typeof window === 'undefined') return false;
    try { return localStorage.getItem(MUTE_KEY) === '1'; } catch { return false; }
  });

  // Build the audio elements once on the client.
  useEffect(() => {
    const saved = (() => {
      try { return localStorage.getItem(MUTE_KEY) === '1'; } catch { return false; }
    })();

    (Object.keys(FILES) as Sfx[]).forEach((k) => {
      const a = new Audio(FILES[k]);
      a.preload = 'auto';
      if (LOOPED.includes(k)) a.loop = true;
      a.muted = saved;
      pool.current[k] = a;
    });

    const current = pool.current;
    return () => {
      Object.values(current).forEach((a) => {
        a.pause();
        a.src = '';
      });
    };
  }, []);

  const play = useCallback((name: Sfx, { restart = true } = {}) => {
    const a = pool.current[name];
    if (!a) return;
    if (restart) a.currentTime = 0;
    // play() can reject if no gesture yet — swallow, we never autoplay critical sound.
    a.play().catch(() => {});
  }, []);

  const stop = useCallback((name: Sfx) => {
    const a = pool.current[name];
    if (!a) return;
    a.pause();
    a.currentTime = 0;
  }, []);

  const stopAll = useCallback(() => {
    Object.values(pool.current).forEach((a) => {
      a.pause();
      a.currentTime = 0;
    });
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      Object.values(pool.current).forEach((a) => { a.muted = next; });
      try { localStorage.setItem(MUTE_KEY, next ? '1' : '0'); } catch {}
      return next;
    });
  }, []);

  return { play, stop, stopAll, muted, toggleMute };
}
