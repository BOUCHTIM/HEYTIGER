'use client';

import { AnimatePresence } from 'framer-motion';
import { useNavOverlay } from './useNavOverlay';
import NavToggle from './NavToggle';
import NavOverlay from './NavOverlay';

export default function NavOverlayRoot() {
  const { isOpen, toggle, close } = useNavOverlay();

  return (
    <>
      <NavToggle isOpen={isOpen} onClick={toggle} />
      <AnimatePresence>{isOpen && <NavOverlay onClose={close} />}</AnimatePresence>
    </>
  );
}
