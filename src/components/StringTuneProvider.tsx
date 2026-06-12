'use client';

import { useEffect } from 'react';
import { StringTune, StringProgress, StringParallax, StringMagnetic } from '@fiddle-digital/string-tune';

declare global {
  interface Window {
    stringTuneEngine?: unknown;
  }
}

export default function StringTuneProvider() {
  useEffect(() => {
    if (window.stringTuneEngine) return;

    try {
      const engine = StringTune.getInstance();
      
      // Register only needed modules
      engine.use(StringProgress);
      engine.use(StringParallax);
      engine.use(StringMagnetic);
      
      // Start engine
      engine.start(60);
      
      window.stringTuneEngine = engine;
      
      // Add ready class for CSS
      document.documentElement.classList.add('st-ready');
      
      console.log('[StringTune] initialized');
    } catch (err) {
      console.warn('[StringTune] initialization failed:', err);
      // Still add st-ready so page looks normal even if StringTune fails
      document.documentElement.classList.add('st-ready');
    }

    return () => {
      try {
        if (window.stringTuneEngine) {
          (window.stringTuneEngine as any).stop?.();
        }
      } catch (e) {
        // no-op
      }
      window.stringTuneEngine = undefined;
      document.documentElement.classList.remove('st-ready');
    };
  }, []);

  return null;
}
