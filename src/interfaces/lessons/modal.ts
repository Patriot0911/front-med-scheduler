import { IModalBaseProps } from '../shared/modal';
import type { ILessonsFilters, TLessonsFilterKey } from './filters';
import type { ILesson } from './lesson';

export interface ILessonDetailsModalProps extends IModalBaseProps {
  lesson: ILesson | null;
};

export interface ILessonsFiltersModalProps extends IModalBaseProps {
  filterKeys: readonly TLessonsFilterKey[];
  filters: ILessonsFilters;
  onApply: (filters: ILessonsFilters) => void;
};

export type ILessonsFiltersFormProps = Omit<ILessonsFiltersModalProps, 'isOpen'>;
