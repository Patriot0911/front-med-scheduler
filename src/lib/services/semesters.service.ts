import type { ISemester, ISemesterPayload, ISemesterResponse } from '@/interfaces/dictionaries/semesters';
import type { IFilterParams } from '@/interfaces/shared/services';
import { apiClient } from '../axios';

export enum SemestersQueryKey {
  SemestersList = 'semestersList',
};

class SemestersService {
  static async getSemesters(params: IFilterParams = { page: 1, pageSize: 20 }): Promise<ISemesterResponse> {
    return apiClient.get('/semesters', { params, });
  }

  static async createSemester(payload: ISemesterPayload): Promise<ISemester> {
    return apiClient.post('/semesters', payload);
  }

  static async editSemester(id: string, payload: ISemesterPayload): Promise<boolean> {
    return apiClient.put(`/semesters/${id}`, payload);
  }

  static async deleteSemester(id: string): Promise<ISemester> {
    return apiClient.delete(`/semesters/${id}`);
  }
}

export default SemestersService;
