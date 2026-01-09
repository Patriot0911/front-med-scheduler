import { InputHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { FieldValues, Path, } from 'react-hook-form';

export interface IFormInputProps<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: Path<T>;
};

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'success';

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