'use client';

import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import type { ITextareaProps } from '@/interfaces/ui/inputs';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

const Textarea = ({
  label,
  error,
  hint,
  hideErrorMessage,
  touched,
  maxRows,
  rows = 3,
  className,
  id,
  name,
  value,
  ref,
  onInput,
  ...props
}: ITextareaProps & { ref?: React.Ref<HTMLTextAreaElement> }) => {
  const textareaId = id ?? name;
  const errorId = textareaId ? `${textareaId}-error` : undefined;
  const hasError = Boolean(error);
  const innerRef = useRef<HTMLTextAreaElement | null>(null);

  // auto-grow: fit the content height on every change, the CSS max-height caps it
  const fitHeight = () => {
    const textarea = innerRef.current;
    if (!maxRows || !textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useLayoutEffect(fitHeight, [value, maxRows]);

  const setRefs = (node: HTMLTextAreaElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <div className={styles.controller}>
      {(!!label || !!hint) && (
        <div className={styles['label-wrapper']}>
          {!!label && (
            <label htmlFor={textareaId} className={cn(hasError && styles['error-state'])}>
              {label} {!!props.required && ' *'}
            </label>
          )}
          {!!hint && <span className={styles.hint}>{hint}</span>}
        </div>
      )}
      <div
        className={cn(
          className,
          styles['controller-input'],
          touched && styles['controller-input__touched'],
          hasError && styles['controller-input__error'],
          props.disabled && styles['controller-input__disabled'],
        )}
      >
        <textarea
          {...props}
          ref={setRefs}
          id={textareaId}
          name={name}
          value={value}
          rows={rows}
          onInput={(e) => {
            fitHeight();
            onInput?.(e);
          }}
          className={cn(!!maxRows && styles['auto-grow'])}
          style={maxRows ? { '--textarea-max-rows': maxRows, } as CSSProperties : undefined}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
        />
      </div>
      {!hideErrorMessage && hasError && (
        <span className={styles['controller-error']} id={errorId}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Textarea;
