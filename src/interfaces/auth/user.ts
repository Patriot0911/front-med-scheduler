import type { IStudentProfile, ITeacherProfile } from '../users/users';

export interface IAuthUser {
  id: string;
  email: string;
  fullName: string;
  permissions: string[];
  /** Role names */
  roles: string[];
  teacher: ITeacherProfile | null;
  student: IStudentProfile | null;
};
