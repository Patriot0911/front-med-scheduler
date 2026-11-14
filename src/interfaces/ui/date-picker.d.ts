import type { Dayjs } from 'dayjs';
import { FieldValues, Path } from 'react-hook-form';

export type TDatePickerMode = 'day' | 'week' | 'month';

export type TDatePickerLevel = 'days' | 'months' | 'years';

export interface IDatePickerProps {
  value: Date;
  mode?: TDatePickerMode;
  onChange: (date: Date) => void;
  /** Without its own border and shadow, to sit inside another panel */
  embedded?: boolean;
  className?: string;
};

export interface ITimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  /** Minutes between the options (default 5); a value off the step stays selectable */
  minuteStep?: number;
};

export interface IDateTimeFieldProps {
  value: Date | null;
  onChange: (date: Date) => void;
  onBlur?: () => void;
  /** Also pick the time: a time column next to the calendar */
  withTime?: boolean;
  minuteStep?: number;
  name?: string;
  label?: string;
  hint?: string;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  hideErrorMessage?: boolean;
};

export interface IFormDateTimeFieldProps<T extends FieldValues>
  extends Omit<IDateTimeFieldProps, 'value' | 'onChange' | 'onBlur' | 'error' | 'touched' | 'name'> {
  name: Path<T>;
};

export interface IMonthGridProps {
  /** Any day of the month to show */
  month: Dayjs;
  /** Whole weeks are picked: hovering and selecting highlight the row */
  weekMode?: boolean;
  isDaySelected?: (day: Dayjs) => boolean;
  isWeekSelected?: (week: Dayjs[]) => boolean;
  /** Always selected and not clickable, e.g. the first lesson of a series */
  isDayLocked?: (day: Dayjs) => boolean;
  isDayDisabled?: (day: Dayjs) => boolean;
  /** Without it the grid only shows the selection */
  onDayClick?: (day: Dayjs) => void;
  /** Neighbour-month days to leave blank, e.g. those already shown by another month side by side */
  isOutsideDayHidden?: (day: Dayjs) => boolean;
  /** Neighbour-month days on a solid background instead of only muted text */
  shadeOutsideDays?: boolean;
  /** Selected days next to each other in a week merge into one strip */
  joinSelectedDays?: boolean;
};

export interface IMultiMonthCalendarProps {
  /** Highlighted days */
  selected: Date[];
  /** Click toggles a day; without it the calendar is read-only */
  onToggle?: (day: Date) => void;
  lockedDates?: Date[];
  /** Days before it can't be picked */
  minDate?: Date;
  /** Shown first (left); default: the month of the first selected day or today */
  initialMonth?: Date;
  /** Months side by side (default 2) */
  months?: number;
  className?: string;
};
