import type { IModalBaseProps } from '../shared/modal';
import type { UseFormReturn } from 'react-hook-form';
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

export interface IEditLessonGroupPayload {
  name: string;
  note?: string;
};

export interface ILessonGroupsTableProps {
  search: string;
  page: number;
  onPageChange: (page: number) => void;
  /** Row click and «Manage»: the group's details and lessons */
  onOpen: (group: ILessonGroup) => void;
  /** Shown with the manage permission */
  onDelete?: (group: ILessonGroup) => void;
};

export interface ILessonGroupModalProps extends IModalBaseProps {
  group: ILessonGroup | null;
  canManage: boolean;
  onDelete: (group: ILessonGroup) => void;
};

export interface IDeleteLessonGroupModalProps extends IModalBaseProps {
  group: ILessonGroup | null;
  onDeleted?: () => void;
};

export interface IAssignLessonsModalProps extends IModalBaseProps {
  group: ILessonGroup | null;
};


export interface IAdminLessonGroupsListProps {
  /** Edit, delete and the lessons actions; otherwise groups open read-only */
  canManage: boolean;
};

interface ILessonGroupScreenProps {
  group: ILessonGroup;
  canManage: boolean;
};

export interface ILessonGroupOverviewProps extends ILessonGroupScreenProps {
  /** Kept by the modal, so edits survive a visit to the lessons screen */
  methods: UseFormReturn<{ name: string; note: string }>;
  onOpenLessons: () => void;
  onDelete: (group: ILessonGroup) => void;
  onClose: () => void;
};

export interface ILessonGroupLessonsProps extends ILessonGroupScreenProps {
  onBack: () => void;
};
