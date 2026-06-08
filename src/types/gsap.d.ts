/* ═══════════════════════════════════════════════════════════════════════
   CDN Globals — GSAP 3 · ScrollTrigger · Swiper 11
   Loaded via <Script strategy="afterInteractive"> in layout.tsx.
   All three are window-globals; these declarations let TypeScript know.
   ═══════════════════════════════════════════════════════════════════════ */

type GSAPVars = Record<string, unknown>;

/* ── GSAP Timeline ────────────────────────────────────────────────────── */
interface GSAPTimeline {
  to(target: unknown, vars: GSAPVars, position?: number | string): this;
  from(target: unknown, vars: GSAPVars, position?: number | string): this;
  fromTo(
    target: unknown,
    fromVars: GSAPVars,
    toVars: GSAPVars,
    position?: number | string,
  ): this;
  set(target: unknown, vars: GSAPVars, position?: number | string): this;
  play(from?: number): this;
  pause(atTime?: number): this;
  resume(): this;
  reverse(): this;
  kill(): void;
  duration(): number;
  eventCallback(type: string, fn: (() => void) | null): this;
  add(item: unknown, position?: number | string): this;
  clear(): this;
  invalidate(): this;
  then(fn: () => void): Promise<void>;
}

/* ── GSAP Context (scope / cleanup API) ──────────────────────────────── */
interface GSAPContext {
  revert(): void;
  kill(): void;
  add(fn: () => void): void;
}

/* ── Core GSAP object ─────────────────────────────────────────────────── */
interface GSAP {
  registerPlugin(...args: unknown[]): void;

  to(target: unknown, vars: GSAPVars): GSAPTimeline;
  from(target: unknown, vars: GSAPVars): GSAPTimeline;
  fromTo(
    target: unknown,
    fromVars: GSAPVars,
    toVars: GSAPVars,
  ): GSAPTimeline;
  set(target: unknown, vars: GSAPVars): void;
  timeline(vars?: GSAPVars): GSAPTimeline;

  ticker: {
    add(fn: (time: number, deltaTime: number, frame: number) => void): void;
    remove(fn: (...args: unknown[]) => void): void;
    lagSmoothing(threshold: number, adjustedLag?: number): void;
    fps(value?: number): void;
  };

  utils: {
    toArray<T = HTMLElement>(target: unknown): T[];
    clamp(min: number, max: number, value: number): number;
    mapRange(
      inMin: number,
      inMax: number,
      outMin: number,
      outMax: number,
      value?: number,
    ): number | ((v: number) => number);
    interpolate(a: unknown, b: unknown, progress: number): unknown;
    wrap(min: number, max: number, value?: number): number | ((v: number) => number);
  };

  context(fn: () => (() => void) | void, scope?: unknown): GSAPContext;
  killTweensOf(target: unknown, properties?: string): void;
  getProperty(target: unknown, property: string, unit?: string): number | string;
  quickSetter(
    target: unknown,
    property: string,
    unit?: string,
  ): (value: number) => void;
  delayedCall(delay: number, fn: () => void, params?: unknown[]): GSAPTimeline;
  matchMedia(): {
    add(query: string, fn: () => (() => void) | void): void;
    revert(): void;
  };
  effects: Record<string, unknown>;
}

/* ── ScrollTrigger ────────────────────────────────────────────────────── */
interface ScrollTriggerInstance {
  progress: number;
  direction: number;
  isActive: boolean;
  vars: GSAPVars;
  trigger: HTMLElement | null;
  scroller: HTMLElement | Window;
  kill(revert?: boolean): void;
  refresh(): void;
  enable(reset?: boolean, refresh?: boolean): void;
  disable(reset?: boolean): void;
  scroll(position?: number): number;
}

interface ScrollTriggerStatic {
  update(): void;
  refresh(safe?: boolean): void;
  create(vars: GSAPVars): ScrollTriggerInstance;
  getAll(): ScrollTriggerInstance[];
  getById(id: string): ScrollTriggerInstance | null;
  kill(revert?: boolean): void;
  killAll(revert?: boolean): void;
  batch(targets: unknown, vars: GSAPVars): ScrollTriggerInstance[];
  addEventListener(type: string, fn: () => void): void;
  removeEventListener(type: string, fn: () => void): void;
  normalizeScroll(value?: boolean | GSAPVars): void;
  defaults(vars: GSAPVars): void;
  config(vars: GSAPVars): void;
  saveStyles(targets: unknown): () => void;
  snapDirectional(snapIncrement: number): (value: number, direction?: number) => number;
  isTouch: number;
  version: string;
}

/* ── Swiper ───────────────────────────────────────────────────────────── */
interface SwiperInstance {
  destroy(deleteInstance?: boolean, cleanStyles?: boolean): void;
  update(): void;
  slideTo(index: number, speed?: number, runCallbacks?: boolean): void;
  slideNext(speed?: number, runCallbacks?: boolean): void;
  slidePrev(speed?: number, runCallbacks?: boolean): void;
  autoplay: { start(): void; stop(): void; running: boolean };
  el: HTMLElement;
  activeIndex: number;
  realIndex: number;
  slides: HTMLElement[];
  params: GSAPVars;
  on(event: string, fn: (...args: unknown[]) => void): void;
  off(event: string, fn: (...args: unknown[]) => void): void;
}

/* ── Window augmentation ──────────────────────────────────────────────── */
declare global {
  interface Window {
    gsap: GSAP;
    ScrollTrigger: ScrollTriggerStatic;
    Swiper: new (
      container: HTMLElement | string,
      config: GSAPVars,
    ) => SwiperInstance;
    /* set by SmoothScroll.tsx */
    __lenis?: import('lenis').default;
    __gsap_lenis_tick?: (
      time: number,
      deltaTime: number,
      frame: number,
    ) => void;
  }
}

export {};
