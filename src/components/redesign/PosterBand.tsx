import Image from 'next/image';

export default function PosterBand() {
  return (
    <div className="rd-poster" aria-hidden="true">
      <Image
        src="/images/home/poster-collage-korean.webp"
        alt=""
        width={2400}
        height={1307}
        sizes="100vw"
        quality={90}
        className="rd-poster__img"
        data-reveal="fade"
      />
    </div>
  );
}
