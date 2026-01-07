import type { IFormInputProps } from '@/interfaces/ui/inputs';
import { cn } from '@/lib/cn';
import { FieldValues } from 'react-hook-form';

import styles from './styles.module.scss';

const FormInput = <T extends FieldValues>({
  label, bindName, error, rules, register, className, ...inputProps
}: IFormInputProps<T>) => {
  return (
    <div className={styles['controller-container']}>
      <label htmlFor={bindName}>{label}</label>

      <input
        {...register(bindName, rules)}
        {...inputProps}
        id={bindName}
        aria-invalid={!!error}
        aria-describedby={`${bindName}-error`}
        className={
          cn(className, styles['controller-input'], error && styles['controller-input__error'])
        }
      />

      <span className={styles['controller-error']} id={`${bindName}-error`}>
        {error}
      </span>
    </div>
  );
}

export default FormInput;
