import Image from 'next/image';
import { MENU_TEASER } from '@/data/site';
import { RdButton } from './primitives';

export default function MenuTeaser() {
  return (
    <section className="rd-teaser" aria-labelledby="teaser-title">
      <div style={{ display: 'flex', flexDirection: 'column' }} data-reveal-group>
        <p className="rd-teaser__intro rd-label" data-reveal>{MENU_TEASER.intro}</p>
        <p className="rd-teaser__jp rd-jp" lang="ja" data-reveal>{MENU_TEASER.jp}</p>
        <h2 id="teaser-title" className="rd-teaser__title rd-display" data-reveal="mask">
          {MENU_TEASER.titleA}<br />{MENU_TEASER.titleB}
        </h2>
        <div className="rd-teaser__cta" data-reveal>
          <RdButton variant="outline-red" href="/menu">{MENU_TEASER.cta}</RdButton>
        </div>
      </div>
      <div className="rd-teaser__art" aria-hidden="true" data-reveal="fade" data-parallax="-0.06">
        {/* Animated line-art from Figma (1.5 s loop) as VP9 WebM with alpha, so it sits on ivory with
            no baked background. Browsers without alpha-video support fall back to the transparent still. */}
        <video
          className="rd-teaser__illo rd-teaser__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/home/illustration-geisha-tiger.webp"
          width={858}
          height={1072}
        >
          <source src="/videos/illustration-geisha-tiger.webm" type='video/webm; codecs="vp9"' />
        </video>
        <Image
          src="/images/home/illustration-geisha-tiger.webp"
          alt=""
          width={858}
          height={1072}
          sizes="(max-width: 900px) 60vw, 40vw"
          className="rd-teaser__illo rd-teaser__still"
        />
      </div>
    </section>
  );
}
