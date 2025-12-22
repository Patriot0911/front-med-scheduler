import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { IModalProps } from '@/src/interfaces/shared/modal';
import { cn } from '@/src/lib/cn';

import styles from './styles.module.scss';

const Modal = ({ children, isOpen, onClose, className, }: IModalProps) => {

  useEffect(() => {
    if (!isOpen) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onEsc);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className={cn(styles.modal, className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
