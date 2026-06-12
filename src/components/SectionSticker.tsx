'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';

type Position = 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';

export default function SectionSticker({
  src,
  alt,
  position = 'bottom-right',
  size = 'medium',
  rotate = 0,
  filter,
  onClick,
}: {
  src: string;
  alt: string;
  position?: Position;
  size?: 'small' | 'medium' | 'large';
  rotate?: number;
  filter?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduceMotion = !!useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  const sizes = {
    small: 'clamp(72px, 7vw, 120px)',
    medium: 'clamp(100px, 10vw, 180px)',
    large: 'clamp(140px, 14vw, 240px)',
  };

  const positions: Record<Position, any> = {
    'top-right': { top: 'clamp(16px, 2.5vw, 32px)', right: 'clamp(16px, 3vw, 48px)' },
    'bottom-right': { bottom: 'clamp(16px, 2.5vw, 32px)', right: 'clamp(16px, 3vw, 48px)' },
    'bottom-left': { bottom: 'clamp(16px, 2.5vw, 32px)', left: 'clamp(16px, 3vw, 48px)' },
    'top-left': { top: 'clamp(16px, 2.5vw, 32px)', left: 'clamp(16px, 3vw, 48px)' },
  };

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      initial={{ opacity: 0, y: 24, rotate }}
      animate={isInView ? { opacity: 1, y: 0, rotate } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.3, 1] }}
      onClick={onClick}
      style={{
        position: 'absolute',
        ...positions[position],
        zIndex: 1,
        opacity: reduceMotion ? 1 : opacity,
        y: reduceMotion ? 0 : y,
        cursor: onClick ? 'pointer' : 'default',
        filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.25))',
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={180}
        height={180}
        unoptimized
        style={{
          width: sizes[size],
          height: 'auto',
          objectFit: 'contain',
          filter: filter,
        }}
      />
    </motion.div>
  );
}

