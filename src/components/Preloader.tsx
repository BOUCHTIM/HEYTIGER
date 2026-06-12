'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const STORAGE_KEY = 'ht_preloader_seen';
const LAST_SHOWN_KEY = 'ht_preloader_last_ts';

/* Broadcast timeline — hard cuts, no crossfades. `dur` is the hold in ms. */
type CardId =
  | 'boot'
  | 'hey'
  | 'flash-red'
  | 'tiger'
  | 'oitora'
  | 'raar'
  | 'flash-cream'
  | 'city'
  | 'logo';

const TIMELINE: { id: CardId; dur: number }[] = [
  { id: 'boot', dur: 240 },
  { id: 'hey', dur: 380 },
  { id: 'flash-red', dur: 80 },
  { id: 'tiger', dur: 380 },
  { id: 'oitora', dur: 340 },
  { id: 'raar', dur: 400 },
  { id: 'flash-cream', dur: 70 },
  { id: 'city', dur: 440 },
  { id: 'logo', dur: 620 },
];

const TOTAL_MS = TIMELINE.reduce((s, c) => s + c.dur, 0);
const EXIT_MS = 760;
const FAILSAFE_MS = TOTAL_MS + EXIT_MS + 1800;
const SLATS = 6;

function cardAt(elapsed: number): number {
  let t = 0;
  for (let i = 0; i < TIMELINE.length; i++) {
    t += TIMELINE[i].dur;
    if (elapsed < t) return i;
  }
  return TIMELINE.length - 1;
}

/* ─── HUD chrome — corners, coordinates, progress ─────────────────── */
function Hud({ progress }: { progress: number }) {
  const corner = {
    position: 'absolute' as const,
    width: '26px',
    height: '26px',
    borderColor: 'rgba(200,61,32,0.8)',
    borderStyle: 'solid',
    borderWidth: 0,
  };
  const label = {
    position: 'absolute' as const,
    fontFamily: 'var(--font-body)',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '0.34em',
    color: 'rgba(240,235,216,0.5)',
    textTransform: 'uppercase' as const,
    whiteSpace: 'nowrap' as const,
  };
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 'clamp(14px, 2.4vw, 30px)', zIndex: 5, pointerEvents: 'none' }}>
      <span style={{ ...corner, top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 }} />
      <span style={{ ...corner, top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2 }} />
      <span style={{ ...corner, bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2 }} />
      <span style={{ ...corner, bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2 }} />

      <span style={{ ...label, top: 4, left: 40 }}>HEY TIGER — MOTOR CITY DUBAI</span>
      <span className="htki-hide-sm" style={{ ...label, top: 4, right: 40 }}>25.0417°N / 55.2450°E</span>
      <span className="htki-hide-sm" style={{ ...label, bottom: 4, left: 40 }}>47 SAKE LABELS · OPEN TILL 2AM</span>
      <span style={{ ...label, bottom: 4, right: 40, color: 'rgba(240,235,216,0.65)' }}>SKIP →</span>

      {/* timeline progress */}
      <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: '2px', background: 'rgba(240,235,216,0.12)' }}>
        <div style={{ width: `${Math.round(progress * 100)}%`, height: '100%', background: 'var(--clr-red)' }} />
      </div>
    </div>
  );
}

/* ─── Cards ───────────────────────────────────────────────────────── */
function Card({ id }: { id: CardId }) {
  const slam = {
    fontFamily: 'var(--font-anton)',
    fontWeight: 400,
    textTransform: 'uppercase' as const,
    lineHeight: 0.84,
    letterSpacing: '-0.01em',
    margin: 0,
  };
  const micro = {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(10px, 1vw, 12px)',
    fontWeight: 800,
    letterSpacing: '0.4em',
    textTransform: 'uppercase' as const,
    margin: 0,
  };

  switch (id) {
    case 'boot':
      return (
        <div className="htki-card" style={{ textAlign: 'center' }}>
          <p style={{ ...micro, color: 'rgba(240,235,216,0.55)' }}>
            <span lang="ja" style={{ fontFamily: 'var(--font-jp)', letterSpacing: '0.3em' }}>おいトラ</span> — BROADCAST 001
          </p>
        </div>
      );
    case 'hey':
      return (
        <div className="htki-card htki-punch-in htki-jit" style={{ textAlign: 'center' }}>
          <h2 style={{ ...slam, fontSize: 'clamp(120px, 30vw, 460px)', color: 'var(--clr-cream)' }}>HEY,</h2>
        </div>
      );
    case 'flash-red':
      return (
        <div className="htki-card" style={{ position: 'absolute', inset: 0, background: 'var(--clr-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span lang="ja" aria-hidden="true" style={{ fontFamily: 'var(--font-jp-rough)', fontSize: 'clamp(90px, 22vw, 320px)', color: 'var(--clr-void)', lineHeight: 1 }}>虎</span>
        </div>
      );
    case 'tiger':
      return (
        <div className="htki-card htki-punch-out" style={{ textAlign: 'center', position: 'relative' }}>
          <h2 aria-hidden="true" style={{ ...slam, fontSize: 'clamp(120px, 30vw, 460px)', color: 'transparent', WebkitTextStroke: '2px rgba(240,235,216,0.55)', position: 'absolute', inset: 0, transform: 'translate(0.035em, -0.03em)' }}>TIGER</h2>
          <h2 style={{ ...slam, fontSize: 'clamp(120px, 30vw, 460px)', color: 'var(--clr-red)', position: 'relative' }}>TIGER</h2>
        </div>
      );
    case 'oitora':
      return (
        <div className="htki-card htki-punch-in htki-jit" style={{ position: 'absolute', inset: 0, background: 'var(--clr-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span lang="ja" style={{ fontFamily: 'var(--font-jp-rough)', fontSize: 'clamp(64px, 17vw, 250px)', color: 'var(--clr-void)', lineHeight: 1, letterSpacing: '0.02em' }}>おいトラ</span>
        </div>
      );
    case 'raar':
      return (
        <div className="htki-card htki-punch-in" style={{ textAlign: 'center', position: 'relative' }}>
          <span lang="ja" aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-jp-rough)', fontSize: 'clamp(160px, 38vw, 560px)', color: 'rgba(200,61,32,0.16)', lineHeight: 1, pointerEvents: 'none' }}>虎</span>
          <h2 style={{ ...slam, fontSize: 'clamp(72px, 17vw, 260px)', color: 'var(--clr-cream)', position: 'relative' }}>RAAAAAAR</h2>
          <h2 style={{ ...slam, fontSize: 'clamp(72px, 17vw, 260px)', color: 'var(--clr-red)', position: 'relative' }}>CULTURE</h2>
        </div>
      );
    case 'flash-cream':
      return <div className="htki-card" style={{ position: 'absolute', inset: 0, background: 'var(--clr-cream)' }} />;
    case 'city':
      return (
        <div className="htki-card htki-punch-out htki-jit" style={{ textAlign: 'center' }}>
          <p style={{ ...micro, color: 'var(--clr-red)', marginBottom: '18px' }}>MOTOR CITY · DUBAI</p>
          <h2 style={{ ...slam, fontSize: 'clamp(64px, 15vw, 230px)', color: 'var(--clr-cream)' }}>
            OPEN TILL
            <span style={{ display: 'block', color: 'var(--clr-red)' }}>2AM</span>
          </h2>
        </div>
      );
    case 'logo':
      return (
        <div className="htki-card htki-punch-in" style={{ textAlign: 'center' }}>
          <p lang="ja" style={{ fontFamily: 'var(--font-jp-rough)', fontSize: 'clamp(18px, 2.4vw, 32px)', color: 'var(--clr-red)', margin: '0 0 14px', lineHeight: 1 }}>おいトラ</p>
          <h2 style={{ ...slam, fontSize: 'clamp(88px, 21vw, 330px)', color: 'var(--clr-cream)' }}>
            HEY TIGER
          </h2>
          <div aria-hidden="true" className="htki-bar" style={{ height: 'clamp(8px, 1.2vw, 16px)', background: 'var(--clr-red)', margin: 'clamp(14px, 2vw, 24px) auto 0', width: 'min(62vw, 560px)' }} />
          <p style={{ ...micro, color: 'rgba(240,235,216,0.55)', marginTop: '18px' }}>ANOTHER ROUND? — POWERED BY BRASS MONKEY HOSPITALITY</p>
        </div>
      );
  }
}

/* ─── Preloader — kinetic broadcast intro ─────────────────────────── */
export default function Preloader() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<'play' | 'exit'>('play');
  const [cardIdx, setCardIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const holdRef = useRef<number | null>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const reduceMotion = !!useReducedMotion();

  /* Show gating — once per session, again on reload. ?intro=1 forces,
     ?intro=off suppresses, ?card=N holds a single card for art direction. */
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get('intro') === 'off') return;
      const force = sp.get('intro') === '1' || sp.has('card');
      const cardParam = sp.get('card');
      if (cardParam !== null) {
        const n = Number(cardParam);
        if (Number.isInteger(n) && n >= 0 && n < TIMELINE.length) holdRef.current = n;
      }

      const alreadySeen = sessionStorage.getItem(STORAGE_KEY) === '1';
      const lastShownTs = Number(sessionStorage.getItem(LAST_SHOWN_KEY) ?? '0');
      const navType = (() => {
        const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
        if (entry?.type) return entry.type;
        const legacy = (performance as unknown as { navigation?: { type?: number } }).navigation?.type;
        return legacy === 1 ? 'reload' : 'navigate';
      })();
      const shouldShowOnReload = navType === 'reload' && Date.now() - lastShownTs > 600;

      if (!force && alreadySeen && !shouldShowOnReload) return;
      sessionStorage.setItem(STORAGE_KEY, '1');
      sessionStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
      window.setTimeout(() => setVisible(true), 0);
    } catch {
      window.setTimeout(() => setVisible(true), 0);
    }
  }, []);

  /* Timeline driver */
  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = 'hidden';

    /* Reduced motion — single static card, brief, no slams or wipes. */
    if (reduceMotion && holdRef.current === null) {
      setCardIdx(TIMELINE.length - 1);
      setProgress(1);
      const t = setTimeout(() => setVisible(false), 1100);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = '';
      };
    }

    /* Hold mode — pin one card for review. */
    if (holdRef.current !== null) {
      setCardIdx(holdRef.current);
      setProgress(holdRef.current / (TIMELINE.length - 1));
      return () => {
        document.body.style.overflow = '';
      };
    }

    let raf = 0;
    let start: number | null = null;

    const begin = () => {
      const tick = (t: number) => {
        if (phaseRef.current === 'exit') return;
        if (start === null) start = t;
        const elapsed = t - start;
        setCardIdx(cardAt(elapsed));
        setProgress(Math.min(1, elapsed / TOTAL_MS));
        if (elapsed >= TOTAL_MS) {
          setPhase('exit');
          return;
        }
        raf = window.requestAnimationFrame(tick);
      };
      raf = window.requestAnimationFrame(tick);
    };

    /* Give the slam font a beat to arrive so the first cut lands in Anton. */
    let cancelled = false;
    Promise.race([
      document.fonts?.load('400 100px Anton').catch(() => undefined) ?? Promise.resolve(),
      new Promise((res) => setTimeout(res, 350)),
    ]).then(() => {
      if (!cancelled) begin();
    });

    const failsafe = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = '';
    }, FAILSAFE_MS);

    const skip = () => setPhase('exit');
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skip();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      clearTimeout(failsafe);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [visible, reduceMotion]);

  /* Exit — slice wipe done, release the page. */
  useEffect(() => {
    if (phase !== 'exit') return;
    const t = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = '';
    }, EXIT_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (!visible) return null;

  const card = TIMELINE[cardIdx];

  return (
    <div
      aria-hidden="true"
      onPointerDown={() => {
        if (holdRef.current === null) setPhase('exit');
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'hidden',
        cursor: 'pointer',
        background: phase === 'exit' ? 'transparent' : undefined,
        pointerEvents: phase === 'exit' ? 'none' : 'auto',
      }}
    >
      {/* Slice slats — the backdrop during play, the wipe on exit */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: 1 }}>
        {Array.from({ length: SLATS }).map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={phase === 'exit' ? { y: '-102%' } : { y: '0%' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1], delay: phase === 'exit' ? i * 0.05 : 0 }}
            style={{ flex: 1, background: 'var(--clr-void)' }}
          />
        ))}
      </div>

      {phase === 'play' && (
        <>
          {/* Forward-momentum floor grid */}
          <div aria-hidden="true" className="htki-gridwrap" style={{ position: 'absolute', inset: 0, zIndex: 2, overflow: 'hidden' }}>
            <div className="htki-grid" />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(60% 36% at 50% 62%, rgba(200,61,32,0.16) 0%, transparent 70%)',
              }}
            />
          </div>

          {/* Active card — keyed remount per cut so punch/jitter re-trigger */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(20px, 4vw, 60px)' }}>
            <div key={card.id} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Card id={card.id} />
            </div>
          </div>

          <Hud progress={progress} />
        </>
      )}

      <style>{`
        .htki-grid {
          position: absolute;
          left: -30%;
          right: -30%;
          top: 38%;
          bottom: -45%;
          background-image:
            repeating-linear-gradient(to right, rgba(200,61,32,0.22) 0 1px, transparent 1px 90px),
            repeating-linear-gradient(to bottom, rgba(200,61,32,0.22) 0 1px, transparent 1px 90px);
          transform: perspective(820px) rotateX(64deg);
          transform-origin: 50% 0%;
          animation: htki-rush 0.9s linear infinite;
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.2) 100%);
          mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.2) 100%);
        }
        @keyframes htki-rush {
          from { background-position: 0 0; }
          to   { background-position: 0 90px; }
        }
        .htki-punch-in  { animation: htki-pin 150ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        .htki-punch-out { animation: htki-pout 150ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        .htki-jit       { animation-name: htki-pin, htki-jitter; animation-duration: 150ms, 100ms; animation-timing-function: cubic-bezier(0.16,1,0.3,1), steps(2, end); animation-delay: 0ms, 210ms; animation-fill-mode: both, none; }
        .htki-punch-out.htki-jit { animation-name: htki-pout, htki-jitter; }
        @keyframes htki-pin  { from { scale: 1.07; } to { scale: 1; } }
        @keyframes htki-pout { from { scale: 0.93; } to { scale: 1; } }
        @keyframes htki-jitter {
          0%   { translate: 0 0; }
          50%  { translate: 8px 0; }
          100% { translate: -3px 0; }
        }
        .htki-bar { animation: htki-barwipe 240ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both; transform-origin: left center; }
        @keyframes htki-barwipe { from { scale: 0 1; } to { scale: 1 1; } }
        @media (max-width: 640px) {
          .htki-hide-sm { display: none; }
        }
      `}</style>
    </div>
  );
}
