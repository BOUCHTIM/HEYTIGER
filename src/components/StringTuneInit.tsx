'use client';

/**
 * StringTuneInit
 * Bootstraps StringTune (Fiddle Digital) with StringParallax + StringProgress.
 *
 * CORRECT API (discovered by introspection):
 *   const engine = new lib.StringTune();
 *   engine.use(lib.StringParallax);
 *   engine.use(lib.StringProgress);
 *   engine.start();
 *
 * StringTune writes --progress (0→1) as an *inline style* on each
 * [string="parallax"] element. Our CSS classes (ht-st-*, ht-scroll-progress-bar)
 * read var(--progress) — the inline value takes precedence over any default.
 *
 * The <body> gets class "st-ready" only after the engine starts, which lets
 * CSS gate animations so content is always visible on first paint.
 */

import Script from 'next/script';

declare global {
  interface Window {
    StringTune?: {
      StringTune: new () => {
        use(module: unknown): void;
        start(): void;
        scrollManager: {
          setDesktopMode(mode: string): void;
          setMobileMode?(mode: string): void;
        };
      };
      StringParallax: unknown;
      StringProgress: unknown;
    };
    _htSTEngine?: unknown;
  }
}

function bootStringTune() {
  const lib = window.StringTune;
  if (!lib) return;

  // Avoid double-starting across hot reloads
  if (window._htSTEngine) return;

  try {
    const engine = new lib.StringTune();
    engine.use(lib.StringParallax);
    engine.use(lib.StringProgress);
    engine.start();

    // Use native scroll (window.scrollY) instead of StringTune's virtual
    // smooth-scroll engine which intercepts wheel events and starts at 0.
    // "default" = read scrollContainer.scrollTop / window.scrollY directly.
    engine.scrollManager.setDesktopMode('default');
    engine.scrollManager.setMobileMode?.('default');

    // Force an initial scroll pass so --progress is correct on first paint
    window.dispatchEvent(new Event('scroll'));

    window._htSTEngine = engine;

    // Mark html so CSS can activate animations (prevents flash-of-invisible-text)
    document.documentElement.classList.add('st-ready');
  } catch (err) {
    console.warn('[StringTune] init failed:', err);
    // Always reveal content even if StringTune errors
    document.documentElement.classList.add('st-ready');
  }
}

export default function StringTuneInit() {
  return (
    <Script
      id="string-tune"
      src="https://unpkg.com/@fiddle-digital/string-tune@1.0.2/dist/index.js"
      strategy="afterInteractive"
      onLoad={bootStringTune}
    />
  );
}
