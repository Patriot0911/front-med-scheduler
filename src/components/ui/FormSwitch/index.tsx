'use client';

import { FieldValues, useController, useFormContext } from 'react-hook-form';
import { IFormSwitchProps } from '@/interfaces/ui/switch';
import Switch from '@/components/ui/Switch';

/** Switch bound to a boolean form field. */
const FormSwitch = <T extends FieldValues>({ name, ...props }: IFormSwitchProps<T>) => {
  const { control, } = useFormContext<T>();
  const { field, } = useController({ name, control });

  return (
    <Switch
      {...props}
      checked={Boolean(field.value)}
      onChange={(checked) => {
        field.onChange(checked);
        field.onBlur();
      }}
    />
  );
};

export default FormSwitch;
