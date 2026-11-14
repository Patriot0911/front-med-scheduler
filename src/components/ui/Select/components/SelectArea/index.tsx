import { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';
import { useSelectContext } from '../../context';

import styles from './styles.module.scss';

interface ISelectAreaProps extends PropsWithChildren {
  className?: string;
}

/** The option list, portaled and placed by Select (useFloatingPanel) */
const SelectArea = ({ children, className }: ISelectAreaProps) => {
  const { isOpen, panelRef, } = useSelectContext();

  if (!isOpen) return null;

  return createPortal(
    <div ref={panelRef} className={cn(styles.area, className)} role="listbox">
      {children}
    </div>,
    document.body,
  );
};

export default SelectArea;
