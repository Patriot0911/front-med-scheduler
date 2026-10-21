import type { ICreateUserPayload, IUser } from '@/interfaces/users/users';
import { apiClient } from '../axios';

export enum UsersQueryKey {
  UsersList = 'usersList',
};

class UsersService {
  static async getUsers() {
    return apiClient.get('/users');
  }

  static async createUser(payload: ICreateUserPayload): Promise<IUser> {
    return apiClient.post('/users', payload);
  }
}

export default UsersService;
