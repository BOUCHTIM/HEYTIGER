'use client';

import { useState } from 'react';
import Image from 'next/image';
import { WHATS_ON, WHATS_ON_INTRO, type EventKind } from '@/data/site';
import { Arrow } from './primitives';

type Filter = 'ALL' | EventKind;
const FILTERS: Filter[] = ['ALL', 'WEEKLY', 'EVENT'];

export default function WhatsOn() {
  const [filter, setFilter] = useState<Filter>('ALL');
  const items = WHATS_ON.filter(e => filter === 'ALL' || e.kind === filter);

  return (
    <section id="whats-on" className="rd-whatson" aria-labelledby="whatson-title">
      <div className="rd-whatson__head" data-reveal-group>
        <span className="rd-whatson__jp rd-whatson__jp--top rd-jp" lang="ja" aria-hidden="true" data-reveal>イベント</span>
        <h2 id="whatson-title" className="rd-whatson__title rd-display" data-reveal="mask">WHAT&rsquo;S ON</h2>
      </div>
      <div className="rd-whatson__intro rd-label" data-reveal>
        {WHATS_ON_INTRO.lines.map(l => <p key={l}>{l}</p>)}
      </div>

      <div className="rd-whatson__bar" data-reveal>
        <ul className="rd-filter" role="group" aria-label="Filter events">
          {FILTERS.map(f => (
            <li key={f}>
              <button
                type="button"
                className="rd-filter__btn"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            </li>
          ))}
        </ul>
        <span className="rd-whatson__jp rd-jp" lang="ja">イベント</span>
      </div>

      <ul className="rd-cards" aria-live="polite" data-reveal-group data-reveal-proxy>
        {items.map(e => (
          <li key={e.id} style={{ display: 'contents' }}>
            <a className={`rd-card${e.image ? '' : ' rd-card--empty'}`} href={`#${e.id}`} onClick={ev => ev.preventDefault()} data-reveal>
              {e.image ? (
                <Image
                  src={e.image}
                  alt=""
                  fill
                  sizes="(max-width: 560px) 78vw, 270px"
                  className="rd-card__img"
                />
              ) : (
                <div className="rd-card__ph" aria-hidden="true">
                  <Image src="/images/icons/icon-ticket-star.webp" alt="" width={314} height={314} />
                </div>
              )}
              <div className="rd-card__shade" aria-hidden="true" />
              <span className="rd-card__tag">{e.kind}</span>
              <span className="rd-card__jp rd-jp" lang="ja">{e.jp}</span>
              <div className="rd-card__body">
                <h3 className="rd-card__title rd-groovy">{e.title}</h3>
                <p className="rd-card__desc rd-label">{e.description}</p>
                <p className="rd-card__when rd-label">
                  <span>{e.when}</span>
                  <Arrow className="rd-btn__arrow" />
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
