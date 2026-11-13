import type { IGenericListResponse } from '../shared/generic-response';

export interface ILessonGroup {
  id: string;
  name: string;
  note: string | null;
  createdByTeacherId: string | null;
  createdByTeacherName: string | null;
  departmentId: string | null;
  departmentName: string | null;
  lessonsCount: number;
  firstLessonDate: string | null;
  lastLessonDate: string | null;
};

export type ILessonGroupsResponse = IGenericListResponse<ILessonGroup>;

export interface ILessonGroupsListParams {
  page: number;
  pageSize: number;
  search?: string;
  departmentId?: string;
};

export interface ILessonGroupsTableProps {
  search: string;
  page: number;
  onPageChange: (page: number) => void;
};
