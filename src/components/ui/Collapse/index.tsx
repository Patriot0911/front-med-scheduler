'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ICollapseProps } from '@/interfaces/ui/collapse';

/**
 * Clip only while the height animates, so open dropdowns inside (e.g. Select) are not cut off.
 * `overflow` is set by framer in the same frame the animation starts (a React state would lag a frame
 * and let the content overflow the modal), and it is in both variants because framer resets
 * values missing from the next variant back to the initial one.
 */
const collapseVariants = {
  hidden: { height: 0, opacity: 0, overflow: 'hidden' },
  visible: { height: 'auto', opacity: 1, overflow: 'hidden', transitionEnd: { overflow: 'visible' } },
};

/** Mounts / unmounts its content with a smooth height transition. */
const Collapse = ({ isOpen, className, children, }: ICollapseProps) => {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          variants={collapseVariants}
          initial='hidden'
          animate='visible'
          exit='hidden'
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div className={className}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Collapse;
