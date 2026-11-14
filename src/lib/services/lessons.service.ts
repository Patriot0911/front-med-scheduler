import type { ICreateLessonPayload, IEditLessonPayload, ILesson, ILessonsListParams, ILessonsResponse, IMyLessonsParams } from '@/interfaces/lessons/lesson';
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

  static async createLesson(payload: ICreateLessonPayload): Promise<ILesson> {
    return apiClient.post('/lessons', payload);
  }

  static async editLesson(lessonId: string, payload: IEditLessonPayload): Promise<ILesson> {
    return apiClient.patch(`/lessons/${lessonId}`, payload);
  }

  static async editAdminLesson(lessonId: string, payload: IEditLessonPayload): Promise<ILesson> {
    return apiClient.patch(`/admin/lessons/${lessonId}`, payload);
  }

  static async deleteAdminLessons(lessonIds: string[]): Promise<number> {
    return apiClient.post('/admin/lessons/delete', { lessonIds, });
  }

  static async getAdminLessons(params: ILessonsListParams): Promise<ILessonsResponse> {
    return apiClient.get('/admin/lessons', { params, paramsSerializer: PARAMS_SERIALIZER, });
  }
}

export default LessonsService;
