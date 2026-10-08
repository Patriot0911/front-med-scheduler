import { ICalendarProps } from '../ui/calendar';

export type ILessonsCalendarProps = Pick<
  ICalendarProps,
  'height' | 'date' | 'view' | 'onDateChange' | 'onViewChange'
>;

export type IQuerySyncedCalendarProps = Pick<ICalendarProps, 'height'>;
