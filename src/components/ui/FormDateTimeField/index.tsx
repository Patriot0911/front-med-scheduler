'use client';

import { FieldValues, useController, useFormContext } from 'react-hook-form';
import type { IFormDateTimeFieldProps } from '@/interfaces/ui/date-picker';
import DateTimeField from '@/components/ui/DateTimeField';

/** DateTimeField bound to a Date form field */
const FormDateTimeField = <T extends FieldValues>({ name, ...props }: IFormDateTimeFieldProps<T>) => {
  const { control, formState: { isSubmitted, }, } = useFormContext<T>();
  const { field, fieldState: { error, isTouched, isDirty, }, } = useController({ name, control, });

  const hasValue = Boolean(field.value);
  const touched = (isDirty || isTouched) && !error && hasValue;
  const showError = error && (isSubmitted || isDirty || hasValue);

  return (
    <DateTimeField
      {...props}
      name={field.name}
      value={field.value ?? null}
      onChange={field.onChange}
      onBlur={field.onBlur}
      touched={touched}
      error={showError ? error.message : undefined}
    />
  );
};

export default FormDateTimeField;
