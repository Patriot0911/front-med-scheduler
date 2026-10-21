'use client';

import { LuCheck } from 'react-icons/lu';
import { cn } from '@/lib/cn';
import { IMultiSelectProps, ISelectOption } from '@/interfaces/ui/selectors';
import Select from '@/components/ui/Select';

import styles from './styles.module.scss';

/** Select with several values: options toggle and the dropdown stays open while picking. */
const MultiSelect = <O extends ISelectOption<string, string>>({
  value,
  onChange,
  options,
  renderOption = (option) => option.label,
  renderValue,
  searchable,
  searchPlaceholder,
  ...props
}: IMultiSelectProps<O>) => {
  const selectedOptions = options.filter((option) => value.includes(option.value));

  const toggle = (optionValue: string) => onChange(
    value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue]
  );

  return (
    <Select<O>
      {...props}
      options={options}
      value={undefined}
      onChange={toggle}
      isValueSelected={(optionValue) => value.includes(optionValue)}
      closeOnSelect={false}
      searchable={searchable}
    >
      <Select.Selected<O>>
        {() => renderValue
          ? renderValue(selectedOptions)
          : (
            <span className={styles.value}>
              <span className={styles['value-label']}>{selectedOptions[0].label}</span>
              {selectedOptions.length > 1 && (
                <span className={styles['value-counter']}>+{selectedOptions.length - 1}</span>
              )}
            </span>
          )}
      </Select.Selected>
      <Select.Area>
        <Select.Search placeholder={searchPlaceholder} />
        <Select.Option<O>>
          {(option, isSelected) => (
            <span className={styles.option}>
              <span className={cn(styles.checkbox, isSelected && styles['checkbox__checked'])}>
                {isSelected && <LuCheck size={12} />}
              </span>
              {renderOption(option, isSelected)}
            </span>
          )}
        </Select.Option>
        {value.length > 0 && (
          <div className={styles.footer}>
            <span className={styles.counter}>{value.length} selected</span>
            <button
              type={'button'}
              className={styles.clear}
              onClick={() => onChange([])}
            >
              Clear
            </button>
          </div>
        )}
      </Select.Area>
    </Select>
  );
};

export default MultiSelect;
