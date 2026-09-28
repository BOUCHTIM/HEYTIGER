'use client';

import { useMemo, useState, useRef, useCallback, type CSSProperties } from 'react';
import Image from 'next/image';
import {
  MENU_CATEGORIES, MENU_ITEMS, MENU_NOTICE, DIETARY_LABELS,
  type MenuTab, type Dietary,
} from '@/data/menuRedesign';
import DietaryIcon from './DietaryIcon';

const ALL_DIETARY = Object.keys(DIETARY_LABELS) as Dietary[];
const HOVER_DELAY = 90; // ms — lets the pointer cross the list without flickering categories

/**
 * One category on stage at a time. Hovering (or focusing) a category in the sidebar puts it on
 * stage; the grid re-mounts under a keyed section so the CSS rise-in plays on every switch.
 * Phone: chips switch on tap.
 */
export default function MenuRedesign() {
  const [tab, setTab] = useState<MenuTab>('food');
  const cats = useMemo(() => MENU_CATEGORIES.filter(c => c.tab === tab), [tab]);
  const [active, setActive] = useState<string | undefined>(cats[0]?.id);
  const hoverTimer = useRef<number>(0);

  const switchTab = (t: MenuTab) => {
    setTab(t);
    setActive(MENU_CATEGORIES.find(c => c.tab === t)?.id);
  };

  const select = useCallback((id: string) => {
    window.clearTimeout(hoverTimer.current);
    setActive(id);
  }, []);
  const hover = (id: string) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setActive(id), HOVER_DELAY);
  };
  const unhover = () => window.clearTimeout(hoverTimer.current);

  const current = cats.find(c => c.id === active) ?? cats[0];
  const items = current ? MENU_ITEMS.filter(i => i.categoryId === current.id) : [];

  const renderCats = (chip = false) => (
    <>
      {cats.map(c => (
        <li key={c.id} style={chip ? { display: 'contents' } : undefined}>
          <button
            type="button"
            className={chip ? 'rd-chip' : 'rd-cats__btn'}
            aria-current={active === c.id ? 'true' : undefined}
            onClick={() => select(c.id)}
            onMouseEnter={chip ? undefined : () => hover(c.id)}
            onMouseLeave={chip ? undefined : unhover}
            onFocus={() => select(c.id)}
          >
            <span>{c.en}</span>
            {!chip && <span className="rd-jp" lang="ja">{c.jp}</span>}
          </button>
        </li>
      ))}
    </>
  );

  return (
    <div className="rd-menu">
      <aside className="rd-menu__side" aria-label="Menu sections">
        <div className="rd-tabs" role="tablist" aria-label="Food or drinks">
          {(['food', 'drinks'] as MenuTab[]).map(t => (
            <button key={t} type="button" role="tab" className="rd-tabs__btn" aria-selected={tab === t} onClick={() => switchTab(t)}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        <ul className="rd-cats">{renderCats()}</ul>
        <ul className="rd-menu__chips" style={{ listStyle: 'none', margin: 0 }}>{renderCats(true)}</ul>
      </aside>

      <main className="rd-menu__main">
        <div className="rd-menu__top">
          <p className="rd-menu__notice">{MENU_NOTICE}</p>
          <ul className="rd-legend" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {ALL_DIETARY.map(d => (
              <li key={d} className="rd-legend__item"><DietaryIcon kind={d} /><span>{DIETARY_LABELS[d]}</span></li>
            ))}
          </ul>
        </div>

        {current && (
          <section key={current.id} id={`cat-${current.id}`} className="rd-menu__section" aria-labelledby={`h-${current.id}`} aria-live="polite">
            <h2 id={`h-${current.id}`} className="rd-menu__h">
              <span>{current.en}</span><span className="rd-jp" lang="ja">{current.jp}</span>
            </h2>
            {items.length === 0 ? (
              <p className="rd-label" style={{ color: 'var(--rd-red)', opacity: 0.8 }}>COMING SOON — ASK THE TEAM FOR TONIGHT&rsquo;S LIST.</p>
            ) : (
              <ul className="rd-menu__grid" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {items.map((i, n) => (
                  <li key={i.id} className="rd-dish" style={{ '--i': n } as CSSProperties}>
                    <div className={`rd-dish__media${i.image ? '' : ' rd-dish__media--ph'}`}>
                      {i.image && (
                        <Image src={i.image} alt={i.name} fill sizes="(max-width: 900px) 50vw, 25vw" />
                      )}
                      {i.dietary.length > 0 && (
                        <div className="rd-dish__diet">
                          {i.dietary.map(d => <DietaryIcon key={d} kind={d} light />)}
                        </div>
                      )}
                    </div>
                    <div className="rd-dish__body">
                      <div className="rd-dish__row">
                        <span className="rd-dish__name">{i.name}</span>
                        <span className="rd-dish__price">AED {i.priceAED}</span>
                      </div>
                      <p className="rd-dish__desc rd-label">{i.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
