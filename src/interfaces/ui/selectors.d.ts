import { PropsWithChildren } from 'react';
import { FieldValues, Path } from 'react-hook-form';

export interface ISelectOption<T = string, K = string> {
  value: T;
  label: K;
};

export interface ISelectContext<O extends ISelectOption<T, K>, T = string, K = string> {
  options: O[];
  value: T | undefined;
  selectedOption: O | undefined;
  onChange: (value: T) => void;
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  showError: boolean;
  showTouched: boolean;
  searchable: boolean;
  search: string;
  setSearch: (value: string) => void;
};

export interface ISelectProps<O extends ISelectOption<string, string>> extends PropsWithChildren {
  options: O[];
  value: string | undefined;
  onChange: (value: string) => void;
  onBlur?: () => void;
  label?: string;
  hideOptionalFlag?: boolean;
  hint?: string;
  error?: string;
  hideErrorMessage?: boolean;
  placeholder?: string;
  className?: string;
  required?: boolean;
  touched?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  filterOption?: (option: O, search: string) => boolean;
};

export interface IFormSelectProps<T extends FieldValues, O extends ISelectOption<string, string>>
  extends Omit<ISelectProps<O>, 'value' | 'onChange' | 'onBlur' | 'error' | 'touched'> {
  name: Path<T>;
};

export interface ISelectSearchProps {
  className?: string;
  placeholder?: string;
};
