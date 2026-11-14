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
  duration: number;
  note: string | null;
  semesterId: string | null;
  /** Optional: a series or lessons that belong together */
  lessonGroupId: string | null;
  lessonGroupName: string | null;
  /** The head of each of them can edit the lesson */
  departmentIds: string[];
  departments: ILessonRef[];
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
  /** Only lessons outside of any lesson group */
  withoutLessonGroup?: boolean;
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

export interface ICreateLessonPayload {
  name: string;
  date: string;
  duration: number;
  lessonGroupId?: string | null;
  teacherIds: string[];
  studentGroupIds: string[];
  semesterId?: string | null;
  departmentIds?: string[];
  visibility?: LessonVisibility;
  note?: string;
};

/**
 * How a series repeats: not at all (the group gets only this lesson, more are added later), every day,
 * chosen weekdays every week or every other week, or hand-picked days
 */
export type TRecurrencePattern = 'none' | 'daily' | 'weekly' | 'biweekly' | 'custom';

/** A new lesson group with a lesson at each date; every lesson shares the `lesson` fields */
export interface ICreateLessonSeriesPayload {
  lessonGroup: { name: string; note?: string };
  lesson: Omit<ICreateLessonPayload, 'date' | 'lessonGroupId'>;
  dates: string[];
};

/** PATCH: the fields to change */
export type IEditLessonPayload = Partial<ICreateLessonPayload>;

export type IAddLessonsToGroupPayload = Omit<ICreateLessonSeriesPayload, 'lessonGroup'>;

/** Where a new lesson starts: a clicked / selected calendar slot or now */
export interface ILessonDraft {
  start: Date;
  duration: number;
};
