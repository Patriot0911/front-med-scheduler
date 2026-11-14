export interface ICheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Part of a set is checked, e.g. «select all» with some rows picked; a click checks all */
  indeterminate?: boolean;
  label?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
};
