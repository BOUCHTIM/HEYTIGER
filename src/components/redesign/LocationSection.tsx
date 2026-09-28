import Image from 'next/image';
import { LOCATION, LOCATION_RIDER } from '@/data/site';
import { restaurantInfo } from '@/data/restaurant';
import { RdButton } from './primitives';

export default function LocationSection({ onReserve }: { onReserve: () => void }) {
  return (
    <section id="location" className={`rd-location${LOCATION_RIDER ? ' rd-location--rider' : ''}`} aria-labelledby="location-title">
      <div className="rd-location__text" data-reveal-group>
        <span className="rd-location__jp rd-jp" lang="ja" data-reveal>{LOCATION.jp}</span>
        <h2 id="location-title" className="rd-location__title rd-display" data-reveal="mask">{LOCATION.title}</h2>

        <div className="rd-location__block" data-reveal>
          <p className="rd-location__lead rd-label">{LOCATION.lead}</p>
          <RdButton variant="outline-ivory" href={restaurantInfo.googleMapsUrl}>{LOCATION.mapCta}</RdButton>
        </div>

        <div className="rd-location__block" data-reveal>
          <p className="rd-location__lead rd-label">{LOCATION.reminder}</p>
          <RdButton variant="ivory" onClick={onReserve}>{LOCATION.reserveCta}</RdButton>
        </div>
      </div>

      <div className="rd-location__art" aria-hidden="true" data-reveal="fade" data-parallax="0.05">
        <Image
          src="/images/home/location-city-collage.webp"
          alt=""
          width={1536}
          height={1024}
          quality={90}
          sizes="(max-width: 900px) 150vw, 83vw"
        />
      </div>
      {LOCATION_RIDER && (
        <Image
          src={LOCATION_RIDER}
          alt=""
          width={417}
          height={686}
          className="rd-location__rider"
          sizes="(max-width: 900px) 62vw, 29vw"
          aria-hidden="true"
          data-reveal="stamp"
          data-parallax="0.09"
        />
      )}
    </section>
  );
}
