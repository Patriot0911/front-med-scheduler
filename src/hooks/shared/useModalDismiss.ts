import { useEffect, useEffectEvent } from 'react';

// open modals, the last one on top: a modal opened from another one is above it
const openModals: symbol[] = [];

/** While open: Escape closes the top modal only, the page behind does not scroll */
const useModalDismiss = (isOpen: boolean, onClose: () => void) => {
  const close = useEffectEvent(onClose);

  useEffect(() => {
    if (!isOpen) return;
    const id = Symbol('modal');
    openModals.push(id);

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openModals.at(-1) === id) close();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onEsc);

    return () => {
      openModals.splice(openModals.indexOf(id), 1);
      if (openModals.length === 0) document.body.style.overflow = '';
      window.removeEventListener('keydown', onEsc);
    };
  }, [isOpen]);
};

export default useModalDismiss;
