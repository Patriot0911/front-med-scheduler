'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import type { ISideModalProps } from '@/interfaces/shared/modal';
import useModalDismiss from '@/hooks/shared/useModalDismiss';
import { cn } from '@/lib/cn';
import Loading from '../Loading';
import { ModalLayoutContext } from '../Modal/context';
import ModalHeader from '../Modal/components/ModalHeader';
import ModalFormBody from '../Modal/components/ModalFormBody';
import ModalContent from '../Modal/components/ModalContent';
import ModalFooter from '../Modal/components/ModalFooter';

import styles from './styles.module.scss';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { x: '100%' },
  visible: { x: 0 },
};

/** A full-height panel sliding in from the right; composed like Modal: Header → FormBody? → Content → Footer */
const SideModal = ({ children, isOpen, isLoading, className, size = 'sm', onClose, }: ISideModalProps) => {
  useModalDismiss(isOpen, onClose);

  if (typeof window !== 'object') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          onClick={onClose}
          variants={overlayVariants}
          initial={'hidden'}
          animate={'visible'}
          exit={'hidden'}
          transition={{ duration: 0.25 }}
        >
          <motion.aside
            role={'dialog'}
            aria-modal={'true'}
            className={cn(styles.panel, styles[size], className)}
            variants={panelVariants}
            initial={'hidden'}
            animate={'visible'}
            exit={'hidden'}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalLayoutContext.Provider value={'side'}>
              {children}
            </ModalLayoutContext.Provider>
            <motion.div
              className={cn(styles['loading-overlay'], !isLoading && styles['loading-overlay--hidden'])}
              initial={{ opacity: 0, }}
              animate={{ opacity: isLoading ? 1 : 0, }}
              transition={{ duration: 0.2, }}
            >
              {isLoading && <Loading />}
            </motion.div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

SideModal.Header = ModalHeader;
SideModal.FormBody = ModalFormBody;
SideModal.Content = ModalContent;
SideModal.Footer = ModalFooter;

export default SideModal;
