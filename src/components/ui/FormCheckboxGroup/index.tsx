'use client';

import { FieldValues, useController, useFormContext } from 'react-hook-form';
import { LuCheck } from 'react-icons/lu';
import { IFormCheckboxGroupProps } from '@/interfaces/ui/checkbox-group';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

/** Multi-select bound to a string[] form field, rendered as toggleable chips. */
const FormCheckboxGroup = <T extends FieldValues>({
  name,
  label,
  options,
  required,
  disabled,
  hint,
  emptyText = 'No options available',
}: IFormCheckboxGroupProps<T>) => {
  const { control, formState: { isSubmitted } } = useFormContext<T>();
  const {
    field,
    fieldState: { error, isDirty },
  } = useController({ name, control });

  const selected: string[] = field.value ?? [];
  const showError = error && (isSubmitted || isDirty);

  const toggle = (value: string) => {
    field.onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
    field.onBlur();
  };

  return (
    <div className={styles.controller}>
      <div className={styles['label-wrapper']}>
        <span className={styles.label}>{label}{required && ' *'}</span>
        <span className={styles.counter}>{selected.length} / {options.length}</span>
      </div>
      <div
        role="group"
        aria-label={label}
        className={cn(styles.options, showError && styles['options__error'])}
      >
        {options.length === 0 && <span className={styles.empty}>{emptyText}</span>}
        {options.map((option) => {
          const isChecked = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              role="checkbox"
              aria-checked={isChecked}
              disabled={disabled}
              className={cn(styles.chip, isChecked && styles['chip__checked'])}
              onClick={() => toggle(option.value)}
            >
              {isChecked && <LuCheck size={14} />}
              {option.label}
            </button>
          );
        })}
      </div>
      {hint && !showError && <span className={styles.hint}>{hint}</span>}
      {showError && <span className={styles.error}>{error?.message}</span>}
    </div>
  );
};

export default FormCheckboxGroup;
