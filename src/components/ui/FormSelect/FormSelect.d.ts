import { FieldValues, Path } from 'react-hook-form';
import { ISelectProps } from '@/interfaces/ui/selectors';
import { ISelectOption } from '@/interfaces/ui/selectors';

export interface IFormSelectProps<T extends FieldValues, O extends ISelectOption<string, string>>
  extends Omit<ISelectProps<O>, 'value' | 'onChange' | 'error' | 'touched'> {
  name: Path<T>;
}
