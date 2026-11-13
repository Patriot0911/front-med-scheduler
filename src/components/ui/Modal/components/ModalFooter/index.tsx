import { IModalFooterProps } from '@/interfaces/shared/modal';
import { cn } from '@/lib/cn';
import { useModalLayout } from '../../context';

import styles from './styles.module.scss';

const ModalFooter = ({ children }: IModalFooterProps) => {
  const layout = useModalLayout();

  return (
    <footer className={cn(styles['footer'], layout === 'side' && styles['footer--side'])}>
      {children}
    </footer>
  );
}

export default ModalFooter;
