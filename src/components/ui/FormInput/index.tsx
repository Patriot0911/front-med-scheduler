import { FieldValues } from 'react-hook-form';
import { IFormInputProps } from '@/interfaces/ui/inputs';
import useFormInputProps from '@/hooks/forms/useFormInputProps';
import Input from '@/components/ui/Input';

const FormInput = <T extends FieldValues>({ name, ...props }: IFormInputProps<T>) => {
  const fieldProps = useFormInputProps<T>(name);

  return <Input {...props} {...fieldProps} />;
};

export default FormInput;
