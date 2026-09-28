import type { Dietary } from '@/data/menuRedesign';
import { DIETARY_LABELS } from '@/data/menuRedesign';

const GLYPH: Record<Dietary, React.ReactNode> = {
  dairy: <path d="M4 1h3v2l1.5 2v5.5H2.5V5L4 3z" />,                                   // bottle
  egg: <ellipse cx="5.5" cy="6" rx="3" ry="4" />,                                          // egg
  gluten: <path d="M5.5 1v9M3 3l2.5 2 2.5-2M3 6l2.5 2 2.5-2" fill="none" stroke="currentColor" strokeWidth="1.1" />, // wheat
  nuts: <path d="M3 3.5a2 2 0 013.5-1.3A2 2 0 018 4.2a2 2 0 01-1 3.6H4.5A2.2 2.2 0 013 3.5z" />, // peanut
  sesame: <><circle cx="3" cy="3" r="1.2" /><circle cx="8" cy="3" r="1.2" /><circle cx="5.5" cy="6" r="1.2" /><circle cx="3" cy="9" r="1.2" /><circle cx="8" cy="9" r="1.2" /></>,
  seafood: <path d="M1.5 6c2-3 5-3 7-.5L10 4v4L8.5 6.5c-2 2.5-5 2.5-7 .5z" />,             // fish
  vegan: <path d="M9.5 1.5C5 1.5 2 4 2 8.5c4.5 0 7-2.5 7.5-7z" />,                          // leaf
  vegetarian: <path d="M5.5 10V5M5.5 5C5.5 2.5 3.5 1.5 1.5 1.5c0 2.5 1.5 4 4 3.5zm0 0c0-2.5 2-3.5 4-3.5 0 2.5-1.5 4-4 3.5z" fill="none" stroke="currentColor" strokeWidth="1.1" />, // sprout
};

export default function DietaryIcon({ kind, light = false }: { kind: Dietary; light?: boolean }) {
  return (
    <span className={`rd-diet${light ? ' rd-diet--light' : ''}`} title={DIETARY_LABELS[kind]} aria-label={DIETARY_LABELS[kind]} role="img">
      <svg viewBox="0 0 11 11" fill="currentColor" aria-hidden="true">{GLYPH[kind]}</svg>
    </span>
  );
}
