import { IModalBaseProps } from '../shared/modal';
import { ICalendarEvent } from '../ui/calendar';
import type { ILessonsFilters, TLessonsFilterKey } from './filters';

export interface IEventDetailsModalProps extends IModalBaseProps {
  event: ICalendarEvent | null;
};

export interface ILessonsFiltersModalProps extends IModalBaseProps {
  filterKeys: readonly TLessonsFilterKey[];
  filters: ILessonsFilters;
  onApply: (filters: ILessonsFilters) => void;
};

export type ILessonsFiltersFormProps = Omit<ILessonsFiltersModalProps, 'isOpen'>;
