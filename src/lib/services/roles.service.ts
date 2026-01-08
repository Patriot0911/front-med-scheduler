import { IFilterParams } from '@/interfaces/shared/services';
import { api } from '../axios';

class RolesService {
  static async getRoles(prams: IFilterParams = { page: 1, pageSize: 20 }) {
    return api.get(`/roles?page=${prams.page}&pageSize=${prams.pageSize}`);
  }
}

export default RolesService;
