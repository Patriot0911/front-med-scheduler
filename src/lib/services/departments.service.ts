import type { IDepartment, IDepartmentPayload, IDepartmentResponse } from '@/interfaces/dictionaries/departments';
import type { IFilterParams } from '@/interfaces/shared/services';
import { apiClient } from '../axios';

export enum DepartmentsQueryKey {
  DepartmentsList = 'departmentsList',
};

class DepartmentsService {
  static async getDepartments(params: IFilterParams = { page: 1, pageSize: 20 }): Promise<IDepartmentResponse> {
    return apiClient.get('/departments', { params, });
  }

  static async createDepartment(payload: IDepartmentPayload): Promise<IDepartment> {
    return apiClient.post('/departments', payload);
  }

  static async editDepartment(id: string, payload: IDepartmentPayload): Promise<boolean> {
    return apiClient.put(`/departments/${id}`, payload);
  }

  static async setDepartmentHead(id: string, teacherId: string | null): Promise<IDepartment> {
    return apiClient.put(`/departments/${id}/head`, { teacherId, });
  }

  static async deleteDepartment(id: string): Promise<IDepartment> {
    return apiClient.delete(`/departments/${id}`);
  }
}

export default DepartmentsService;
