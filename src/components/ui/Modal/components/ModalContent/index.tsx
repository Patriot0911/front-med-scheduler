import { IModalContentProps } from '@/interfaces/shared/modal';
import { cn } from '@/lib/cn';
import { useModalLayout } from '../../context';

import styles from './styles.module.scss';

const ModalContent = ({ children, className, ...props }: IModalContentProps) => {
  const layout = useModalLayout();

  return (
    <div
      {...props}
      className={cn(className, styles['modal-content'], layout === 'side' && styles['modal-content--side'])}
      id={`modal-content${!!props.id ? `-${props.id}` : ''}`}
    >
      {children}
    </div>
  );
}

export default ModalContent;
