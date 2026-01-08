import type { IFormInputProps } from '@/interfaces/ui/inputs';
import { FieldValues, useController, useFormContext } from 'react-hook-form';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

const FormInput = <T extends FieldValues>({
  label,
  name,
  className,
  ...props
}: IFormInputProps<T>) => {
  const { control } = useFormContext<T>();
  const {
    field,
    fieldState: { error, isTouched, isDirty, },
  } = useController({ name, control, });

  return (
    <div className={styles['controller-container']}>
      <label htmlFor={name}>{label}</label>

      <input
        {...field}
        {...props}
        id={name}
        aria-invalid={!!error}
        aria-describedby={`${name}-error`}
        value={field.value ?? ''}
        className={
          cn(
            className,
            styles['controller-input'],
            (isTouched || isDirty) && styles['controller-input__touched'],
            error && styles['controller-input__error'],
          )
        }
      />

      <span className={styles['controller-error']} id={`${name}-error`}>
        {error?.message}
      </span>
    </div>
  );
}

export default FormInput;
