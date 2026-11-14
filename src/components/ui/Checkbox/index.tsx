'use client';

import { LuCheck, LuMinus } from 'react-icons/lu';
import type { ICheckboxProps } from '@/interfaces/ui/checkbox';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

const Checkbox = ({ checked, onChange, indeterminate = false, label, disabled, className, ...props }: ICheckboxProps) => {
  const isMixed = indeterminate && !checked;

  return (
    <label
      className={cn(styles.checkbox, disabled && styles['checkbox--disabled'], className)}
      // a checkbox in a clickable row toggles itself, not the row
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type={'button'}
        role={'checkbox'}
        aria-checked={isMixed ? 'mixed' : checked}
        aria-label={props['aria-label']}
        disabled={disabled}
        className={cn(styles.box, (checked || isMixed) && styles['box--checked'])}
        onClick={() => onChange(isMixed ? true : !checked)}
      >
        {checked && <LuCheck />}
        {isMixed && <LuMinus />}
      </button>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};

export default Checkbox;
