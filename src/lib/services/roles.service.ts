import type { IRole, IRolePayload, IRoleResponse } from '@/interfaces/dictionaries/roles';
import type { IFilterParams } from '@/interfaces/shared/services';
import { apiClient } from '../axios';

export enum RolesQueryKey {
  RolesList = 'rolesList',
};

class RolesService {
  static async getRoles(params: IFilterParams = { page: 1, pageSize: 20 }): Promise<IRoleResponse> {
    return apiClient.get('/roles', { params, });
  }

  static async createRole(payload: IRolePayload): Promise<IRole> {
    return apiClient.post('/roles', payload);
  }

  static async editRole(id: string, payload: IRolePayload): Promise<boolean> {
    return apiClient.put(`/roles/${id}`, payload);
  }

  static async deleteRole(id: string): Promise<IRole> {
    return apiClient.delete(`/roles/${id}`);
  }
}

export default RolesService;
