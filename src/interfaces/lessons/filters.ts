import type { LessonVisibility } from './lesson';

export interface ILessonsFilters {
  lessonGroupIds: string[];
  teacherIds: string[];
  studentGroupIds: string[];
  groupTagIds: string[];
  departmentIds: string[];
  semesterIds: string[];
  visibility: LessonVisibility | '';
};

export type TLessonsFilterKey = keyof ILessonsFilters;
export type TLessonsListFilterKey = Exclude<TLessonsFilterKey, 'visibility'>;

export type TLessonsView = 'study' | 'teaching' | 'department' | 'all' | 'admin';

export interface ILessonsViewConfig {
  filters: readonly TLessonsFilterKey[];
};

export interface ILessonsListFilterConfig {
  label: string;
  placeholder: string;
  searchPlaceholder: string;
};

export interface ILessonsBrowserProps {
  view: TLessonsView;
};

export interface ILessonsToolbarProps {
  filterKeys: readonly TLessonsFilterKey[];
  search: string;
  onSearchChange: (search: string) => void;
  filters: ILessonsFilters;
  onFiltersApply: (filters: ILessonsFilters) => void;
};
