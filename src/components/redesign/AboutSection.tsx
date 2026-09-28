import Image from 'next/image';
import { ABOUT, HERO } from '@/data/site';

export default function AboutSection() {
  return (
    <section id="about" className="rd-about" aria-labelledby="about-title">
      <div className="rd-about__rail" aria-hidden="true">
        <span className="rd-jp" lang="ja">{HERO.jpRail}</span>
        <span className="rd-about__barcode" />
      </div>

      <div className="rd-about__text">
        <p className="rd-about__jp rd-jp" lang="ja">
          {ABOUT.jp.map(line => <span key={line}>{line}</span>)}
        </p>
        <p className="rd-about__kicker">{ABOUT.kicker}</p>
        <h2 id="about-title" className="rd-about__title rd-groovy">{ABOUT.title}</h2>
        <p className="rd-about__body rd-label">{ABOUT.body}</p>
      </div>

      <div className="rd-about__photo">
        {/* desktop frame: glass-brick wall · phone frame: tiger-mural wall */}
        <Image
          src="/images/home/about-people-glassbrick.webp"
          alt="Four friends in sunglasses in front of a glass-brick wall at Hey Tiger"
          fill
          quality={90}
          sizes="50vw"
          className="rd-about__img rd-about__img--desktop"
        />
        <Image
          src="/images/home/about-people-mural.webp"
          alt="Four friends in sunglasses in front of the tiger mural at Hey Tiger"
          fill
          quality={90}
          sizes="100vw"
          className="rd-about__img rd-about__img--phone"
        />
      </div>
      {/* phone frame: the two stickers become a full-width collage between the photo and the menu teaser */}
      <div className="rd-about__stickers" aria-hidden="true" />

      {/* Two stickers straddle the seam between the copy panel and the photo, as in the frame */}
      <Image
        src="/images/stickers/sticker-join-raaar-barcode.webp"
        alt=""
        width={480}
        height={980}
        className="rd-sticker rd-sticker--barcode"
        aria-hidden="true"
      />
      <video
        className="rd-sticker rd-sticker--night"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/stickers/sticker-night-is-still-young.webp"
        width={640}
        height={1120}
        aria-hidden="true"
      >
        <source src="/videos/sticker-night-is-still-young.mp4" type="video/mp4" />
      </video>
    </section>
  );
}
