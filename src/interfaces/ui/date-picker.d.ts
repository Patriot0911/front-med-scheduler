export type TDatePickerMode = 'day' | 'week' | 'month';

export type TDatePickerLevel = 'days' | 'months' | 'years';

export interface IDatePickerProps {
  value: Date;
  mode?: TDatePickerMode;
  onChange: (date: Date) => void;
  className?: string;
};
