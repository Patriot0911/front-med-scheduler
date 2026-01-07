import { InputHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { FieldValues, Path, RegisterOptions, UseFormRegister, } from 'react-hook-form';

export interface IFormInputProps<T extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  bindName: Path<T>;
  register: UseFormRegister<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: string;
};

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger';

export type ButtonSize =
  | 'sm'
  | 'md'
  | 'lg';

export interface IButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}