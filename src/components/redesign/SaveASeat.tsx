'use client';

import Image from 'next/image';
import { SAVE_A_SEAT } from '@/data/site';
import { RdButton } from './primitives';

export default function SaveASeat({ onReserve }: { onReserve: () => void }) {
  return (
    <section id="booking-band" className="rd-seat" aria-labelledby="seat-title">
      <div data-reveal-group>
        <h2 id="seat-title" className="rd-seat__title rd-display" data-reveal="mask">
          {SAVE_A_SEAT.titleA}<br />{SAVE_A_SEAT.titleB}
        </h2>
        <p className="rd-seat__jp rd-jp" lang="ja" data-reveal>{SAVE_A_SEAT.jp}</p>
        <div className="rd-seat__cta" data-reveal>
          <RdButton variant="outline-red" onClick={onReserve}>{SAVE_A_SEAT.cta}</RdButton>
        </div>
      </div>
      <div className="rd-seat__art" aria-hidden="true" data-reveal="right" data-parallax="0.05">
        <Image
          src="/images/home/phone-red-rotary.webp"
          alt=""
          width={1536}
          height={1024}
          quality={90}
          sizes="(max-width: 900px) 100vw, 52vw"
        />
      </div>
    </section>
  );
}
