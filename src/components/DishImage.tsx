'use client';

import { useState } from 'react';
import Image from 'next/image';

interface DishImageProps {
  src: string;
  fallback: string;
  alt?: string;
  className?: string;
  sizes?: string;
  style?: React.CSSProperties;
}

export default function DishImage({ src, fallback, alt = '', className, sizes, style }: DishImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      unoptimized
      sizes={sizes}
      style={style}
      onError={() => {
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
    />
  );
}
