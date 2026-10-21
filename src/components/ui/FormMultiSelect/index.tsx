'use client';

import { FieldValues, useController, useFormContext } from 'react-hook-form';
import { IFormMultiSelectProps, ISelectOption } from '@/interfaces/ui/selectors';
import MultiSelect from '@/components/ui/MultiSelect';

/** MultiSelect bound to a string[] form field. */
const FormMultiSelect = <T extends FieldValues, O extends ISelectOption<string, string>>({
  name,
  hideErrorMessage,
  ...props
}: IFormMultiSelectProps<T, O>) => {
  const { control, formState: { isSubmitted } } = useFormContext<T>();
  const {
    field,
    fieldState: { error, isTouched, isDirty },
  } = useController({ name, control });

  const value: string[] = field.value ?? [];
  const touched = (isDirty || isTouched) && !error && value.length > 0;
  const showError = Boolean(error && (isSubmitted || isDirty));

  return (
    <MultiSelect<O>
      {...props}
      value={value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      touched={touched}
      error={showError ? error?.message : undefined}
      hideErrorMessage={hideErrorMessage}
    />
  );
};

export default FormMultiSelect;
