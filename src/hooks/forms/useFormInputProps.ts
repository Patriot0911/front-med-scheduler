import { FieldValues, Path, useController, useFormContext } from 'react-hook-form';

/**
 * Binds an Input-like field to the surrounding form: value / handlers plus the
 * touched and error state (errors show after submit or once the user typed).
 */
const useFormInputProps = <T extends FieldValues>(name: Path<T>) => {
  const { control, formState: { isSubmitted } } = useFormContext<T>();
  const {
    field,
    fieldState: { error, isTouched, isDirty },
  } = useController({ name, control });

  const hasValue = Boolean(field.value);
  const touched = (isDirty || isTouched) && !error && hasValue;
  const showError = error && (isSubmitted || isDirty || hasValue);

  return {
    ...field,
    value: field.value ?? '',
    touched,
    error: showError ? error.message : undefined,
  };
};

export default useFormInputProps;
