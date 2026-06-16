/**
 * Motion tokens — single source of truth for all animation values.
 * Japanese numerology informs the timing rhythm:
 *   Micro 0.3 · Fast 0.5 · Card 0.7 · Section 1.3 · Hero 1.5 · Cinematic 1.7
 *   Stagger 0.07 / 0.08 / 0.13 / 0.17
 *   Loops 7.8 / 8.0 / 8.8  (never random)
 */

export const MOTION = {
  micro:     0.3,
  fast:      0.5,
  card:      0.7,
  section:   1.3,
  hero:      1.5,
  cinematic: 1.7,
} as const;

export const STAGGER = {
  tight:   0.07,
  card:    0.08,
  section: 0.13,
  loose:   0.17,
} as const;

export const LOOP = {
  standard: 7.8,
  ambient:  8.0,
  drift:    8.8,
} as const;

export const EASE = {
  standard:  [0.4, 0, 0.2, 1]      as const,
  cinematic: [0.22, 1, 0.36, 1]    as const,
  smooth:    [0.25, 0.46, 0.45, 0.94] as const,
} as const;

export type EaseTuple = readonly [number, number, number, number];
