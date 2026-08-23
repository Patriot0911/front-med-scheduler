import { IModalFormBodyProps } from '@/interfaces/shared/modal';
import { FormProvider } from 'react-hook-form';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

const ModalFormBody = ({ children, className, methods, ...props }: IModalFormBodyProps) => {
  return (
    <FormProvider {...methods}>
      <form
        {...props}
        className={cn(className, styles['modal-body'])}
      >
        {children}
      </form>
    </FormProvider>
  );
}

export default ModalFormBody;
