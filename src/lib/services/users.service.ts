import type {
  ICreateUserPayload,
  IEditUserPayload,
  IStudentProfile,
  IStudentProfilePayload,
  ITeacherProfile,
  ITeacherProfilePayload,
  IUser,
  IUserPayload,
  IUsersListParams,
  IUsersResponse,
} from '@/interfaces/users/users';
import { apiClient } from '../axios';

export enum UsersQueryKey {
  UsersList = 'usersList',
};

class UsersService {
  static async getUsers(params: IUsersListParams = { page: 1, pageSize: 20 }): Promise<IUsersResponse> {
    // arrays go as repeated keys (roleIds=a&roleIds=b), which any query parser reads as a list
    return apiClient.get('/users', { params, paramsSerializer: { indexes: null, }, });
  }

  static async createUser(payload: ICreateUserPayload): Promise<IUser> {
    return apiClient.post('/users', payload);
  }

  static async editUser(userId: string, payload: IEditUserPayload): Promise<IUser> {
    return apiClient.put(`/users/${userId}`, payload);
  }

  /** Creates the profile when the user has none, otherwise updates it */
  static async saveTeacherProfile(userId: string, payload: ITeacherProfilePayload): Promise<ITeacherProfile> {
    return apiClient.put(`/users/${userId}/teacher`, payload);
  }

  static async deleteTeacherProfile(userId: string): Promise<ITeacherProfile> {
    return apiClient.delete(`/users/${userId}/teacher`);
  }

  /** Creates the profile when the user has none, otherwise updates it */
  static async saveStudentProfile(userId: string, payload: IStudentProfilePayload): Promise<IStudentProfile> {
    return apiClient.put(`/users/${userId}/student`, payload);
  }

  static async deleteStudentProfile(userId: string): Promise<IStudentProfile> {
    return apiClient.delete(`/users/${userId}/student`);
  }

  /**
   * Same payload as `createUser`, applied to an existing user:
   * the account fields, then each profile is saved, or deleted when it is null and the user had it.
   */
  static async updateUser(user: IUser, { teacher, student, ...account }: IUserPayload): Promise<void> {
    await UsersService.editUser(user.id, account);

    if (teacher) {
      await UsersService.saveTeacherProfile(user.id, teacher);
    } else if (user.teacher) {
      await UsersService.deleteTeacherProfile(user.id);
    }

    if (student) {
      await UsersService.saveStudentProfile(user.id, student);
    } else if (user.student) {
      await UsersService.deleteStudentProfile(user.id);
    }
  }
}

export default UsersService;
