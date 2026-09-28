import { PILLARS } from '@/data/site';

export default function PillarStrip() {
  return (
    <ul className="rd-pillars" aria-label="What Hey Tiger is about" data-reveal-group>
      <li className="rd-pillars__lead" aria-hidden="true" />
      {PILLARS.map(p => (
        <li key={p.en} className="rd-pillar" data-reveal>
          <span className="rd-label">{p.en}</span>
          <span className="rd-jp" lang="ja">{p.jp}</span>
        </li>
      ))}
      <li className="rd-pillars__cap" aria-hidden="true" />
    </ul>
  );
}
