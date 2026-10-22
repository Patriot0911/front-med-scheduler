import type { IGenericListResponse } from '../shared/generic-response';
import type { IFilterParams } from '../shared/services';

export enum UserProfileType {
  Teacher = 'teacher',
  Student = 'student',
  None = 'none',
};

export interface IUsersFilters {
  roleIds: string[];
  profiles: UserProfileType[];
};

export interface IUsersToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  /** Applied filters; the toolbar edits a draft of them until "Apply filters" */
  filters: IUsersFilters;
  onFiltersApply: (filters: IUsersFilters) => void;
  /** Roles filter needs the roles dictionary, which requires its own permission */
  canFilterByRoles: boolean;
  canManage: boolean;
  onCreate: () => void;
};

// Mirrors api-med-scheduler/src/modules/users/models/user-item.model.ts
export interface ITeacherProfile {
  id: string;
  departmentId: string | null;
};

export interface IStudentProfile {
  id: string;
  studentGroupId: string | null;
  isGroupMonitor: boolean;
};

export interface IUser {
  id: string;
  email: string;
  fullName: string;
  roleIds: string[];
  createdAt: string;
  lastLoginAt: string | null;
  teacher: ITeacherProfile | null;
  student: IStudentProfile | null;
};

export type IUsersResponse = IGenericListResponse<IUser>;

/** `roleIds` / `profiles` are not supported by GET /users yet, the API drops them */
export interface IUsersListParams extends IFilterParams, Partial<IUsersFilters> {};

export interface ITeacherProfilePayload {
  departmentId?: string | null;
};

export interface IStudentProfilePayload {
  /** null detaches the student from the group */
  studentGroupId?: string | null;
  isGroupMonitor?: boolean;
};

export interface IEditUserPayload {
  email: string;
  fullName: string;
  /** Missing keeps the current roles */
  roleIds?: string[];
};

/** `teacher` / `student` set the matching profile; null or missing means no profile */
export interface IUserPayload extends IEditUserPayload {
  teacher?: ITeacherProfilePayload | null;
  student?: IStudentProfilePayload | null;
};

export interface ICreateUserPayload extends IUserPayload {
  /** Missing lets the API generate a random one */
  password?: string;
};

export interface IUsersTableProps {
  page: number;
  search: string;
  filters: IUsersFilters;
  canManage: boolean;
  onPageChange: (page: number) => void;
  onEdit: (user: IUser) => void;
};

export interface IUserFormModalProps {
  isOpen: boolean;
  /** null when creating */
  item: IUser | null;
  onClose: () => void;
  /** Roles come from the roles dictionary, which requires its own permission */
  canAssignRoles: boolean;
};
