'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

const STORAGE_KEY = 'ht_preloader_seen';
const LAST_SHOWN_KEY = 'ht_preloader_last_ts';

const PRELOADER_FAILSAFE_MS = 1800;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function Preloader() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<'show' | 'exit'>('show');
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    try {
      const alreadySeen = sessionStorage.getItem(STORAGE_KEY) === '1';
      const lastShownTs = Number(sessionStorage.getItem(LAST_SHOWN_KEY) ?? '0');

      const navType = (() => {
        const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
        if (entry?.type) return entry.type;
        const legacy = (performance as unknown as { navigation?: { type?: number } }).navigation?.type;
        return legacy === 1 ? 'reload' : 'navigate';
      })();

      const shouldShowOnReload = navType === 'reload' && Date.now() - lastShownTs > 600;

      if (alreadySeen && !shouldShowOnReload) return;
      sessionStorage.setItem(STORAGE_KEY, '1');
      sessionStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
      // Defer state updates to avoid "setState in effect" lint rule
      window.setTimeout(() => setVisible(true), 0);
    } catch {
      window.setTimeout(() => setVisible(true), 0);
    }
  }, []);

  /* Phase sequencing */
  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = 'hidden';

    // Defer state updates to avoid "setState in effect" lint rule
    window.setTimeout(() => {
      setPhase('show');
      setProgress(0);
      progressRef.current = 0;
    }, 0);

    let raf = 0;
    let loadedAt: number | null = null;
    let loadedFrom = 0;
    let loadFired = false;

    const onLoad = () => {
      loadFired = true;
    };

    window.addEventListener('load', onLoad, { once: true });

    const startAt = performance.now();

    const tick = (t: number) => {
      const elapsed = t - startAt;

      if (loadFired && loadedAt === null) {
        loadedAt = t;
        loadedFrom = Math.max(0, Math.min(1, progressRef.current));
      }

      const next =
        loadedAt === null
          ? 0.86 * easeOutCubic(Math.max(0, Math.min(1, elapsed / 620)))
          : loadedFrom + (1 - loadedFrom) * easeOutCubic(Math.max(0, Math.min(1, (t - loadedAt) / 320)));

      progressRef.current = next;
      setProgress(next);

      if (next >= 0.999) {
        setPhase('exit');
        return;
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    const t3 = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = '';
    }, PRELOADER_FAILSAFE_MS);

    return () => {
      window.removeEventListener('load', onLoad);
      window.cancelAnimationFrame(raf);
      clearTimeout(t3);
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible) return null;

  const p = Math.max(0, Math.min(1, progress));
  const reveal = easeOutCubic(p);

  return (
    <AnimatePresence
      onExitComplete={() => {
        setVisible(false);
        document.body.style.overflow = '';
      }}
    >
      {phase !== 'exit' ? (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'var(--clr-cream)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              width: 'min(98vw, 1480px)',
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: 'min(clamp(220px, 42vw, 420px), calc(100dvh - 220px))' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 1 - Math.max(0, Math.min(1, progress)) }}>
                <Image
                  src="/heytiger-logo.png"
                  alt="Hey Tiger"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 480px) 98vw, 1480px"
                  style={{
                    objectFit: 'contain',
                    filter: 'brightness(0)',
                    opacity: 0.98,
                  }}
                />
              </div>
              <div style={{ position: 'absolute', inset: 0, opacity: Math.max(0, Math.min(1, progress)) }}>
                <Image
                  src="/heytiger-logo.png"
                  alt=""
                  aria-hidden="true"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 480px) 98vw, 1480px"
                  style={{
                    objectFit: 'contain',
                    filter: 'brightness(0) saturate(100%) invert(20%) sepia(92%) saturate(5400%) hue-rotate(356deg) brightness(98%) contrast(106%)',
                    opacity: 0.98,
                  }}
                />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.985 }}
              animate={{
                opacity: 0.15 + reveal * 0.85,
                y: (1 - reveal) * 14,
                scale: 0.985 + reveal * 0.015,
              }}
              transition={{ duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                marginTop: 'clamp(18px, 2.6vw, 26px)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '0.28em',
                  color: 'var(--clr-red)',
                  textTransform: 'uppercase',
                }}
              >
                Powered by
              </span>
              <motion.div
                aria-hidden="true"
                animate={{ opacity: 0.65 + reveal * 0.35 }}
                transition={{ duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ lineHeight: 0 }}
              >
                <Image
                  src="/BMH-logo.png"
                  alt="Brass Monkey Hospitality"
                  width={260}
                  height={86}
                  priority
                  unoptimized
                  style={{
                    height: '38px',
                    width: 'auto',
                    objectFit: 'contain',
                    filter: 'brightness(0) saturate(100%) invert(20%) sepia(92%) saturate(5400%) hue-rotate(356deg) brightness(98%) contrast(106%)',
                    opacity: 0.92,
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
