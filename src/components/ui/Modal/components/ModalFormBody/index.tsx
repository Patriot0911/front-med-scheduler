import { IModalFormBodyProps } from '@/interfaces/shared/modal';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

const ModalFormBody = ({ children, className, ...props }: IModalFormBodyProps) => {
  return (
    <form
      {...props}
      className={cn(className, styles['modal-body'])}
    >
      {children}
    </form>
  );
}

export default ModalFormBody;
