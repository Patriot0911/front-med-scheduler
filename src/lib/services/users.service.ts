import { api } from '../axios';

class UsersService {
  static async getUsers() {
    return api.get('/users');
  }
}

export default UsersService;
