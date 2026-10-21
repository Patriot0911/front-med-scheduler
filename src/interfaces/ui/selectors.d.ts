import { PropsWithChildren, ReactNode } from 'react';
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
  isSelected: (value: T) => boolean;
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
  /** Overrides the `optionValue === value` check, e.g. for several selected values */
  isValueSelected?: (optionValue: string) => boolean;
  /** Keep the dropdown open after picking an option (multi choice) */
  closeOnSelect?: boolean;
};

export interface IMultiSelectProps<O extends ISelectOption<string, string>>
  extends Omit<ISelectProps<O>, 'value' | 'onChange' | 'children' | 'isValueSelected' | 'closeOnSelect'> {
  value: string[];
  onChange: (value: string[]) => void;
  renderOption?: (option: O, isSelected: boolean) => ReactNode;
  /** Content of the closed select; defaults to the first label and a "+N" counter */
  renderValue?: (selected: O[]) => ReactNode;
  searchPlaceholder?: string;
};

export interface IFormSelectProps<T extends FieldValues, O extends ISelectOption<string, string>>
  extends Omit<ISelectProps<O>, 'value' | 'onChange' | 'onBlur' | 'error' | 'touched'> {
  name: Path<T>;
};

export interface ISelectSearchProps {
  className?: string;
  placeholder?: string;
};
