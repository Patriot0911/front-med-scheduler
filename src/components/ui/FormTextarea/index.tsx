import { FieldValues } from 'react-hook-form';
import { IFormTextareaProps } from '@/interfaces/ui/inputs';
import useFormInputProps from '@/hooks/forms/useFormInputProps';
import Textarea from '@/components/ui/Textarea';

const FormTextarea = <T extends FieldValues>({ name, ...props }: IFormTextareaProps<T>) => {
  const fieldProps = useFormInputProps<T>(name);

  return <Textarea {...props} {...fieldProps} />;
};

export default FormTextarea;
