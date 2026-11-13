import type { ILessonsListParams, ILessonsResponse, IMyLessonsParams } from '@/interfaces/lessons/lesson';
import { apiClient } from '../axios';

export enum LessonsQueryKey {
  List = 'lessonsList',
  My = 'lessonsMy',
  Admin = 'lessonsAdmin',
};

// arrays go as repeated keys (teacherIds=a&teacherIds=b)
const PARAMS_SERIALIZER = { indexes: null, };

class LessonsService {
  static async getLessons(params: ILessonsListParams): Promise<ILessonsResponse> {
    return apiClient.get('/lessons/list', { params, paramsSerializer: PARAMS_SERIALIZER, });
  }

  static async getMyLessons(params: IMyLessonsParams): Promise<ILessonsResponse> {
    return apiClient.get('/lessons/my', { params, paramsSerializer: PARAMS_SERIALIZER, });
  }

  static async getAdminLessons(params: ILessonsListParams): Promise<ILessonsResponse> {
    return apiClient.get('/admin/lessons', { params, paramsSerializer: PARAMS_SERIALIZER, });
  }
}

export default LessonsService;
