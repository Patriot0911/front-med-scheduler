import { FieldValues, Path } from 'react-hook-form';
import { ISelectOption } from './selectors';

export interface IFormCheckboxGroupProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  options: ISelectOption<string, string>[];
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  emptyText?: string;
};
