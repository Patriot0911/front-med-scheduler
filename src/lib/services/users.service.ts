import { apiClient } from '../axios';

class UsersService {
  static async getUsers() {
    return apiClient.get('/users');
  }
}

export default UsersService;
