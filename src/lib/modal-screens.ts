import type { Transition, Variants } from 'framer-motion';

const SHIFT_PX = 32;

/**
 * Screens inside one modal (a list → an item): the next screen comes from the side it leads to.
 * `custom` is the direction: 1 forward (from the right), -1 back, 0 without motion.
 */
export const SCREEN_VARIANTS: Variants = {
  enter: (direction: number) => ({ x: direction * SHIFT_PX, opacity: 0, }),
  center: { x: 0, opacity: 1, },
  exit: (direction: number) => ({ x: -direction * SHIFT_PX, opacity: 0, }),
};

export const SCREEN_TRANSITION: Transition = { duration: 0.18, ease: 'easeOut', };
