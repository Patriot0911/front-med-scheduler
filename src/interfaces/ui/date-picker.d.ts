export type TDatePickerMode = 'day' | 'week' | 'month';

export interface IDatePickerProps {
  value: Date;
  mode?: TDatePickerMode;
  onChange: (date: Date) => void;
  className?: string;
};
