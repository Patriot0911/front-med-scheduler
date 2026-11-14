import { IModalBaseProps } from '../shared/modal';
import type { ILessonsFilters, TLessonsFilterKey, TLessonsSource } from './filters';
import type { ILesson, ILessonDraft } from './lesson';

export interface ILessonDetailsProps {
  lesson: ILesson;
};

export interface ILessonDetailsModalProps extends IModalBaseProps {
  lesson: ILesson | null;
  /** Shown when the lesson's canEdit allows it */
  onEdit?: (lesson: ILesson) => void;
};

export interface ILessonsFiltersModalProps extends IModalBaseProps {
  filterKeys: readonly TLessonsFilterKey[];
  filters: ILessonsFilters;
  onApply: (filters: ILessonsFilters) => void;
};

export type ILessonsFiltersFormProps = Omit<ILessonsFiltersModalProps, 'isOpen'>;

export interface ILessonFormModalProps extends IModalBaseProps {
  /** A new lesson starts here */
  draft: ILessonDraft | null;
  /** Editing this lesson instead of creating one */
  lesson?: ILesson | null;
  /** Start with the teacher's own department selected */
  isDepartmentLesson?: boolean;
  /** `admin` saves through /admin/lessons and lifts the teacher-domain rules */
  source?: TLessonsSource;
};

export type ILessonFormProps = Omit<ILessonFormModalProps, 'isOpen'>;

export interface IRecurrenceSectionProps {
  /** The start of every lesson of the series, built from the rule in the form */
  dates: Date[];
  onRemove: () => void;
};

export interface IWeekLessonsModalProps extends IModalBaseProps {
  /** Monday of the week */
  weekStart: Date | null;
  /** Loaded lessons; the modal keeps those of its week */
  lessons: ILesson[];
  onEdit?: (lesson: ILesson) => void;
  /** «Add lesson» on the clicked day */
  onCreate?: () => void;
};
