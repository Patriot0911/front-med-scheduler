import { FieldValues, Path } from 'react-hook-form';

export interface ISwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  hint?: string;
  disabled?: boolean;
};

export interface IFormSwitchProps<T extends FieldValues> extends Omit<ISwitchProps, 'checked' | 'onChange'> {
  name: Path<T>;
};
