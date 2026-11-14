import type { ICalendarEvent, ICalendarProps } from '../ui/calendar';
import type { ILessonsFilters, TLessonsView } from './filters';
import type { ILesson } from './lesson';

export interface ILessonsCalendarProps extends Pick<
  ICalendarProps<ILesson>,
  'height' | 'date' | 'view' | 'onDateChange' | 'onViewChange' | 'onSlotSelect'
> {
  events: ICalendarEvent<ILesson>[];
  isFetching?: boolean;
  /** Edit from the lesson details, for lessons whose canEdit allows it */
  onEdit?: (lesson: ILesson) => void;
};

export interface IQuerySyncedCalendarProps extends Pick<ICalendarProps, 'height' | 'onSlotSelect'> {
  view: TLessonsView;
  filters?: ILessonsFilters;
  search?: string;
  onEdit?: (lesson: ILesson) => void;
};
