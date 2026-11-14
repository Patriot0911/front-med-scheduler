import type { ITableColumn } from '@/interfaces/ui/table';
import Checkbox from '../Checkbox';

interface ISelectColumnOptions<T> {
  /** Rows of the current page: «select all» toggles these */
  rows: T[];
  getId: (row: T) => string;
  selected: ReadonlySet<string>;
  onChange: (selected: Set<string>) => void;
  /** Rows that can't be picked show a disabled box */
  isSelectable?: (row: T) => boolean;
  /** Read by screen readers for a row's box */
  getLabel?: (row: T) => string;
};

/** A first column of checkboxes; the header box selects or clears every selectable row of the page */
export const createSelectColumn = <T,>({
  rows, getId, selected, onChange, isSelectable = () => true, getLabel,
}: ISelectColumnOptions<T>): ITableColumn<T> => {
  const selectableIds = rows.filter(isSelectable).map(getId);
  const pickedCount = selectableIds.filter((id) => selected.has(id)).length;
  const toggle = (ids: string[], isOn: boolean) => {
    const next = new Set(selected);
    ids.forEach((id) => (isOn ? next.add(id) : next.delete(id)));
    onChange(next);
  };

  return {
    key: 'select',
    width: '2.75rem',
    title: (
      <Checkbox
        aria-label={'Select all rows'}
        checked={selectableIds.length > 0 && pickedCount === selectableIds.length}
        indeterminate={pickedCount > 0}
        disabled={selectableIds.length === 0}
        onChange={(isOn) => toggle(selectableIds, isOn)}
      />
    ),
    render: (row) => (
      <Checkbox
        aria-label={getLabel?.(row) ?? 'Select row'}
        checked={selected.has(getId(row))}
        disabled={!isSelectable(row)}
        onChange={(isOn) => toggle([getId(row)], isOn)}
      />
    ),
  };
};
