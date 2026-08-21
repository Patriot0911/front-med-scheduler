import type { IRoleResponse } from '@/interfaces/dictionaries/roles';
import type { IFilterParams } from '@/interfaces/shared/services';
import { apiClient } from '../axios';

export enum RolesQueryKey {
  RolesList = 'rolesList',
};

class RolesService {
  static async getRoles(prams: IFilterParams = { page: 1, pageSize: 20 }): Promise<IRoleResponse> {
    return apiClient.get(`/roles?page=${prams.page}&pageSize=${prams.pageSize}`);
  }
}

export default RolesService;
