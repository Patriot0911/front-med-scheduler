import type { IGenericListResponse } from '../shared/generic-response';

export enum LessonVisibility {
  All = 'all',
  Involved = 'involved',
};

export type TLessonScope = 'teaching' | 'department' | 'studying';

export interface ILessonRef {
  id: string;
  name: string;
};

export interface ILesson {
  id: string;
  name: string;
  date: string;
  /** The lesson was moved to this date; the calendar shows it there */
  delayedDate: string | null;
  duration: number;
  note: string | null;
  semesterId: string | null;
  lessonGroupId: string;
  lessonGroupName: string;
  departmentId: string | null;
  departmentName: string | null;
  teacherIds: string[];
  studentGroupIds: string[];
  teachers: ILessonRef[];
  studentGroups: ILessonRef[];
  visibility: LessonVisibility;
  canEdit: boolean;
};

export type ILessonsResponse = IGenericListResponse<ILesson>;

export interface ILessonsListParams {
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  lessonGroupIds?: string[];
  teacherIds?: string[];
  studentGroupIds?: string[];
  groupTagIds?: string[];
  departmentIds?: string[];
  semesterIds?: string[];
  visibility?: LessonVisibility;
  page?: number;
  pageSize?: number;
};

export interface IMyLessonsParams extends ILessonsListParams {
  scope?: TLessonScope;
};
