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
  filters: IUsersFilters;
  onFiltersChange: (filters: IUsersFilters) => void;
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

/** `teacher` / `student` create the matching profile; null or missing means no profile */
export interface ICreateUserPayload {
  email: string;
  fullName: string;
  roleIds?: string[];
  teacher?: { departmentId?: string | null } | null;
  student?: { studentGroupId?: string; isGroupMonitor?: boolean } | null;
};

export interface IUserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Roles come from the roles dictionary, which requires its own permission */
  canAssignRoles: boolean;
};
