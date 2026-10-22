import { IInputProps } from '@/interfaces/ui/inputs';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

const Input = ({
  label,
  error,
  hint,
  bottomHint,
  icon,
  onIconClick,
  iconLabel,
  hideErrorMessage,
  hideHintOnError,
  touched,
  className,
  id,
  name,
  ...props
}: IInputProps) => {
  const inputId = id ?? name;
  const hasError = Boolean(error);

  const isHintHidden = (!hasError || !hideHintOnError);

  const showError = (
    !hideErrorMessage && (
      !hideHintOnError || (hideHintOnError && hasError)
    )
  );

  return (
    <div className={styles.controller}>
      {
        (!!label || !!hint) && (
          <div className={styles['label-wrapper']}>
            {!!label && (
              <label
                htmlFor={inputId}
                className={cn(
                  hasError && styles['error-state']
                )}
              >
                {label} {!!props.required && ' *'}
              </label>
            )}
            {(Boolean(hint) && isHintHidden) && (
              <span className={styles.hint}>{hint}</span>
            )}
          </div>
        )
      }
      <div
        className={cn(
          className,
          styles['controller-input'],
          touched && styles['controller-input__touched'],
          hasError && styles['controller-input__error'],
          props.disabled && styles['controller-input__disabled'],
        )}
      >
        <input
          {...props}
          id={inputId}
          className={cn(
            (hasError && !touched) && styles['input__error']
          )}
          name={name}
          aria-invalid={hasError}
          aria-describedby={inputId ? `${inputId}-error` : undefined}
        />
        {icon && (
          <button type="button" className={styles['icon-button']} onClick={onIconClick} aria-label={iconLabel}>
            {icon}
          </button>
        )}
      </div>
      {
        (!!showError && !isHintHidden) && (
          <div className={styles.sub}>
            {(Boolean(bottomHint) && isHintHidden) && (
              <span className={styles.hint}>{bottomHint}</span>
            )}
            {
              showError && (
                <span className={styles['controller-error']} id={inputId ? `${inputId}-error` : undefined}>
                  {error}
                </span>
              )
            }
          </div>
        )
      }
    </div>
  );
};

export default Input;
