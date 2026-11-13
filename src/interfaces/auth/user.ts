import type { IStudentProfile, ITeacherProfile } from '../users/users';

export interface IAuthTeacherProfile extends ITeacherProfile {
  /** The department this teacher heads */
  headOfDepartmentId: string | null;
};

export interface IAuthUser {
  id: string;
  email: string;
  fullName: string;
  permissions: string[];
  /** Role names */
  roles: string[];
  teacher: IAuthTeacherProfile | null;
  student: IStudentProfile | null;
};
