import { InputHTMLAttributes } from 'react';
import { FieldValues, Path, RegisterOptions, UseFormRegister, } from 'react-hook-form';

export interface IFormInputProps<T extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  bindName: Path<T>;
  register: UseFormRegister<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: string;
};
