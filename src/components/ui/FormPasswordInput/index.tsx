'use client';

import { FieldValues } from 'react-hook-form';
import { IFormPasswordInputProps } from '@/interfaces/ui/inputs';
import useFormInputProps from '@/hooks/forms/useFormInputProps';
import PasswordInput from '@/components/ui/PasswordInput';

/** PasswordInput bound to a form field. */
const FormPasswordInput = <T extends FieldValues>({ name, ...props }: IFormPasswordInputProps<T>) => {
  const fieldProps = useFormInputProps<T>(name);

  return <PasswordInput {...props} {...fieldProps} />;
};

export default FormPasswordInput;
