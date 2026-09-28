'use client';

import Image from 'next/image';
import { HERO } from '@/data/site';
import { RdButton } from './primitives';

export default function Hero({ onReserve }: { onReserve: () => void }) {
  return (
    <section id="hero" className="rd-hero" aria-label="Hey Tiger — a social house for the uncommon">
      <div className="rd-hero__rail rd-hero__rail--l" aria-hidden="true">
        <span className="rd-rail">{HERO.eyebrowRail}</span>
        <span className="rd-rail">{HERO.handleRail}</span>
      </div>

      <div className="rd-hero__stage">
        {/* Poster frame stays underneath; the video is hidden for reduced-motion users (CSS). */}
        <Image
          src="/images/home/hero-tiger-sofa.webp"
          alt="A tiger and a woman in a red coat sharing a leather chesterfield"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="rd-hero__img"
        />
        <video
          className="rd-hero__img rd-hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/home/hero-tiger-sofa.webp"
          aria-hidden="true"
        >
          <source src="/videos/hero-tiger-sofa.webm" type="video/webm" />
          <source src="/videos/hero-tiger-sofa.mp4" type="video/mp4" />
        </video>
        <div className="rd-hero__shade" aria-hidden="true" />

        <div className="rd-hero__content">
          <h1 className="rd-hero__title rd-display">
            {HERO.titleA}<br />
            {HERO.titleB} <span className="rd-groovy">{HERO.titleAccent}</span>
          </h1>

          <div className="rd-hero__lines">
            {HERO.lines.map(l => (
              <p key={l.en} className="rd-hero__line">
                <span className="rd-label">{l.en}</span>
                <span className="rd-jp" lang="ja">{l.jp}</span>
              </p>
            ))}
          </div>
          <div className="rd-hero__lines">
            {HERO.lines2.map(l => (
              <p key={l.en} className="rd-hero__line rd-hero__line--stack">
                <span className="rd-label">{l.en}</span>
                <span className="rd-jp" lang="ja">{l.jp}</span>
              </p>
            ))}
          </div>

          <div className="rd-hero__cta">
            <span className="rd-hero__jp-stage rd-jp" lang="ja" aria-hidden="true">{HERO.jpRail}</span>
            <RdButton variant="red" onClick={onReserve}>{HERO.cta}</RdButton>
          </div>
        </div>
      </div>

      <div className="rd-hero__rail rd-hero__rail--r" aria-hidden="true">
        <span />
        <span className="rd-jp" lang="ja">{HERO.jpRail}</span>
      </div>
    </section>
  );
}
