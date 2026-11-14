import { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { FieldValues, Path } from 'react-hook-form';

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  hideHintOnError?: boolean;
  bottomHint?: boolean;
  icon?: ReactNode;
  onIconClick?: () => void;
  /** Accessible name of the icon button, e.g. "Show password" */
  iconLabel?: string;
  hideErrorMessage?: boolean;
  touched?: boolean;
};

export interface IFormInputProps<T extends FieldValues>
  extends Omit<IInputProps, 'name' | 'error' | 'touched'> {
  name: Path<T>;
};

export interface IPasswordInputProps extends Omit<IInputProps, 'type' | 'icon' | 'onIconClick' | 'iconLabel'> {
  /** Show the eye button that reveals the password (default true) */
  canReveal?: boolean;
  /** Controlled visibility; uncontrolled when omitted */
  isRevealed?: boolean;
  onRevealChange?: (isRevealed: boolean) => void;
};

export interface IFormPasswordInputProps<T extends FieldValues>
  extends Omit<IPasswordInputProps, 'name' | 'error' | 'touched'> {
  name: Path<T>;
};

export interface ITextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  hideErrorMessage?: boolean;
  touched?: boolean;
  /** Grows with the content up to this many rows, then scrolls; no manual resize */
  maxRows?: number;
};

export interface IFormTextareaProps<T extends FieldValues>
  extends Omit<ITextareaProps, 'name' | 'error' | 'touched'> {
  name: Path<T>;
};
