import type { ReactNode } from 'react';
import type { ILessonsListParams, LessonVisibility, TLessonScope } from './lesson';

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

/** list: /lessons/list (everything the user may see), my: /lessons/my with a scope, admin: /admin/lessons */
export type TLessonsSource = 'list' | 'my' | 'admin';

export interface ILessonsViewConfig {
  source: TLessonsSource;
  scope?: TLessonScope;
  filters: readonly TLessonsFilterKey[];
  /** The teacher can add lessons here: a button and a click on the calendar */
  canCreate?: boolean;
};

export interface ILessonsListFilterConfig {
  label: string;
  placeholder: string;
  searchPlaceholder: string;
};

export type TLessonsMode = 'calendar' | 'list';

export interface ILessonsBrowserProps {
  view: TLessonsView;
  mode?: TLessonsMode;
};

export interface ILessonsModeSwitchProps {
  value: TLessonsMode;
  onChange: (mode: TLessonsMode) => void;
};

export interface ILessonsTableProps {
  view: TLessonsView;
  /** Filters, search and date bounds; the table adds the page */
  params: ILessonsListParams;
  page: number;
  onPageChange: (page: number) => void;
};

export interface ILessonsToolbarProps {
  filterKeys: readonly TLessonsFilterKey[];
  search: string;
  onSearchChange: (search: string) => void;
  filters: ILessonsFilters;
  onFiltersApply: (filters: ILessonsFilters) => void;
  /** Extra controls in the toolbar row, e.g. view-specific switches */
  children?: ReactNode;
};
