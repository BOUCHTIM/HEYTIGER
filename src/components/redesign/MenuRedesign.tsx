'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import {
  MENU_CATEGORIES, MENU_ITEMS, MENU_NOTICE, DIETARY_LABELS,
  type MenuTab, type Dietary,
} from '@/data/menuRedesign';
import DietaryIcon from './DietaryIcon';

const ALL_DIETARY = Object.keys(DIETARY_LABELS) as Dietary[];

export default function MenuRedesign() {
  const [tab, setTab] = useState<MenuTab>('food');
  const cats = useMemo(() => MENU_CATEGORIES.filter(c => c.tab === tab), [tab]);
  const [active, setActive] = useState<string | undefined>(cats[0]?.id);

  const switchTab = (t: MenuTab) => {
    setTab(t);
    setActive(MENU_CATEGORIES.find(c => c.tab === t)?.id);
  };

  // track which category is in view for the sidebar highlight
  useEffect(() => {
    const els = cats.map(c => document.getElementById(`cat-${c.id}`)).filter(Boolean) as HTMLElement[];
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(entries => {
      const hit = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (hit) setActive(hit.target.id.replace('cat-', ''));
    }, { rootMargin: '-20% 0px -70% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [cats]);

  const jump = (id: string) => {
    setActive(id);
    const el = document.getElementById(`cat-${id}`);
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).lenis;
    if (el && lenis) lenis.scrollTo(el, { offset: -88 });
    else el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderCats = (chip = false) => (
    <>
      {cats.map(c => (
        <li key={c.id} style={chip ? { display: 'contents' } : undefined}>
          <button
            type="button"
            className={chip ? 'rd-chip' : 'rd-cats__btn'}
            aria-current={active === c.id ? 'true' : undefined}
            onClick={() => jump(c.id)}
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

        {cats.map(c => {
          const items = MENU_ITEMS.filter(i => i.categoryId === c.id);
          return (
            <section key={c.id} id={`cat-${c.id}`} className="rd-menu__section" aria-labelledby={`h-${c.id}`}>
              <h2 id={`h-${c.id}`} className="rd-menu__h">
                <span>{c.en}</span><span className="rd-jp" lang="ja">{c.jp}</span>
              </h2>
              {items.length === 0 ? (
                <p className="rd-label" style={{ color: 'var(--rd-red)', opacity: 0.8 }}>COMING SOON — ASK THE TEAM FOR TONIGHT&rsquo;S LIST.</p>
              ) : (
                <ul className="rd-menu__grid" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {items.map(i => (
                    <li key={i.id} className="rd-dish">
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
          );
        })}
      </main>
    </div>
  );
}
