'use client';

import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { SelectContext } from './context';
import useFloatingPanel from '@/hooks/shared/useFloatingPanel';
import { ISelectOption, ISelectProps } from '@/interfaces/ui/selectors';
import SelectArea from './components/SelectArea';
import SelectOption from './components/SelectOption';
import SelectTrigger from './components/SelectTrigger';
import SelectedOption from './components/SelectedOption';
import SelectSearch from './components/SelectSearch';

import styles from './styles.module.scss';

const defaultFilterOption = <O extends ISelectOption<string, string>>(option: O, search: string) =>
  String(option.label).toLowerCase().includes(search.toLowerCase());

const Select = <O extends ISelectOption<string, string>>({
  value,
  onChange,
  onBlur,
  options,
  label,
  hint,
  error,
  hideErrorMessage,
  placeholder = 'Select an option',
  className,
  required,
  touched,
  children,
  showOptionalFlag,
  disabled,
  searchable,
  filterOption = defaultFilterOption,
  isValueSelected,
  closeOnSelect = true,
}: ISelectProps<O>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // an option may have an empty value (e.g. "Not assigned"), so look for the option, not a truthy value
  const isSelected = isValueSelected ?? ((optionValue: string) => optionValue === value);
  const selectedOption = options.find((o) => isSelected(o.value));
  const hasError = Boolean(error);
  const visibleOptions = searchable && search ? options.filter((o) => filterOption(o, search)) : options;

  const close = useCallback(() => {
    if (isOpen) onBlur?.();
    setIsOpen(false);
    setSearch('');
  }, [isOpen, onBlur]);

  // the list is portaled: a scrolling modal neither clips it nor grows because of it
  useFloatingPanel({ isOpen, anchorRef, panelRef, onClose: close, matchWidth: true, });

  return (
    <SelectContext.Provider
      value={{
        options: visibleOptions,
        value,
        selectedOption,
        onChange: (v) => {
          onChange(v);
          if (closeOnSelect) close();
        },
        isSelected,
        isOpen,
        toggle: () => (isOpen ? close() : setIsOpen(true)),
        close,
        showError: hasError,
        showTouched: Boolean(touched),
        searchable: Boolean(searchable),
        search,
        setSearch,
        panelRef,
      }}
    >
      <div className={cn(styles.controller, className)}>
        {(label || (!required && showOptionalFlag)) && (
          <div className={styles['label-wrapper']}>
            {label && (
              <label className={cn(hasError && styles['error-state'])}>
                {label} {required && ' *'}
              </label>
            )}
            {!required && showOptionalFlag && <span className={styles['flag-optional']}>Optional</span>}
          </div>
        )}

        <div
          ref={anchorRef}
          className={cn(
            styles['controller-select'],
            touched && !hasError && styles['controller-select__touched'],
            hasError && styles['controller-select__error'],
            disabled && styles['controller-select__disabled']
          )}
        >
          {children}
          {!selectedOption && <span className={styles.placeholder}>{placeholder}</span>}
          <Select.Trigger
            disabled={disabled}
          />
        </div>

        {(hint || !hideErrorMessage) && (
          <div className={styles.sub}>
            {hint && <span className={styles.hint}>{hint}</span>}
            {!hideErrorMessage && (
              <span className={styles['controller-error']}>{error}</span>
            )}
          </div>
        )}
      </div>
    </SelectContext.Provider>
  );
};

Select.Option = SelectOption;
Select.Selected = SelectedOption;
Select.Area = SelectArea;
Select.Trigger = SelectTrigger;
Select.Search = SelectSearch;

export default Select;
