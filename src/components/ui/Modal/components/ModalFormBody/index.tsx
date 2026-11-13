import { IModalFormBodyProps } from '@/interfaces/shared/modal';
import { FormProvider } from 'react-hook-form';
import { cn } from '@/lib/cn';
import { useModalLayout } from '../../context';

import styles from './styles.module.scss';

const FormWrapper = ({ children, className, ...props }: Omit<IModalFormBodyProps, 'methods'>) => {
  const layout = useModalLayout();

  return (
    <form
      {...props}
      className={cn(className, styles['modal-body'], layout === 'side' && styles['modal-body--side'])}
    >
      {children}
    </form>
  );
}

const ModalFormBody = ({ children, methods, ...props }: IModalFormBodyProps) => {
  if (!methods) {
    return (
      <FormWrapper {...props}>
        {children}
      </FormWrapper>
    )
  }

  return (
    <FormProvider {...methods}>
      <FormWrapper {...props}>
        {children}
      </FormWrapper>
    </FormProvider>
  );
}

export default ModalFormBody;
