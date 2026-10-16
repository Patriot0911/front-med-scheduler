import type { IStudentGroup, IStudentGroupPayload, IStudentGroupResponse } from '@/interfaces/dictionaries/student-groups';
import type { IFilterParams } from '@/interfaces/shared/services';
import { apiClient } from '../axios';

export enum StudentGroupsQueryKey {
  StudentGroupsList = 'studentGroupsList',
};

class StudentGroupsService {
  static async getStudentGroups(params: IFilterParams = { page: 1, pageSize: 20 }): Promise<IStudentGroupResponse> {
    return apiClient.get('/student-groups', { params, });
  }

  static async createStudentGroup(payload: IStudentGroupPayload): Promise<IStudentGroup> {
    return apiClient.post('/student-groups', payload);
  }

  static async editStudentGroup(id: string, payload: IStudentGroupPayload): Promise<boolean> {
    return apiClient.put(`/student-groups/${id}`, payload);
  }

  static async deleteStudentGroup(id: string): Promise<IStudentGroup> {
    return apiClient.delete(`/student-groups/${id}`);
  }
}

export default StudentGroupsService;
