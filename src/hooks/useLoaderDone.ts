'use client';

/**
 * Global "loader finished" signal — dependency-free (no Zustand/Context).
 *
 * The Loader flips this to `true` at ~60% of the curtain wipe (Phase 4) so any
 * component can start its own entrance the moment the stage is revealed:
 *
 *   const ready = useLoaderDone();
 *   <motion.div animate={ready ? 'show' : 'hidden'} ... />
 *
 * Backed by a module-level store read through useSyncExternalStore, so it is
 * SSR-safe (server snapshot is always `false`) and shares one source of truth
 * across the whole tree without a provider.
 */

import { useSyncExternalStore } from 'react';

let loaderDone = false;
const listeners = new Set<() => void>();

/** Imperatively set the signal. Called by the Loader; safe to call anywhere. */
export function setLoaderDone(value: boolean): void {
  if (loaderDone === value) return;
  loaderDone = value;
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): boolean {
  return loaderDone;
}

function getServerSnapshot(): boolean {
  return false;
}

/** Reactive boolean — `true` once the loader has revealed the page. */
export function useLoaderDone(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
