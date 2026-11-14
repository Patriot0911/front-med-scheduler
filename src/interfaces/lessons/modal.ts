import { IModalBaseProps } from '../shared/modal';
import type { ILessonsFilters, TLessonsFilterKey } from './filters';
import type { ILesson, ILessonDraft } from './lesson';

export interface ILessonDetailsModalProps extends IModalBaseProps {
  lesson: ILesson | null;
};

export interface ILessonsFiltersModalProps extends IModalBaseProps {
  filterKeys: readonly TLessonsFilterKey[];
  filters: ILessonsFilters;
  onApply: (filters: ILessonsFilters) => void;
};

export type ILessonsFiltersFormProps = Omit<ILessonsFiltersModalProps, 'isOpen'>;

export interface ILessonFormModalProps extends IModalBaseProps {
  draft: ILessonDraft | null;
  /** Start with the teacher's own department selected */
  isDepartmentLesson?: boolean;
};

export type ILessonFormProps = Omit<ILessonFormModalProps, 'isOpen'> & { draft: ILessonDraft };

export interface IRecurrenceSectionProps {
  /** The start of every lesson of the series, built from the rule in the form */
  dates: Date[];
  onRemove: () => void;
};
