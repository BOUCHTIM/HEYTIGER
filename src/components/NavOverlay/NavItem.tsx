'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import type { NavLink } from '@/constants/navLinks';

interface NavItemProps {
  link: NavLink;
  index: number;
  reduceMotion: boolean;
  onNavigate: () => void;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: 0.5 + i * 0.08 },
  }),
};

export default function NavItem({ link, index, reduceMotion, onNavigate }: NavItemProps) {
  return (
    <motion.div
      custom={index}
      variants={reduceMotion ? undefined : itemVariants}
      initial={reduceMotion ? undefined : 'hidden'}
      animate={reduceMotion ? undefined : 'visible'}
    >
      <motion.div
        whileHover={reduceMotion ? undefined : { x: 12 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <Link href={link.href} onClick={onNavigate} className="nav-overlay-item">
          <span className="nav-overlay-number">{link.number}</span>
          <span className="nav-overlay-label">{link.label}</span>
          <span className="nav-overlay-jp" lang="ja">{link.japanese}</span>
          <span className="nav-overlay-underline" aria-hidden="true" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
