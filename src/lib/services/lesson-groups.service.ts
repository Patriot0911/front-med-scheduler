import type { ILessonGroupsListParams, ILessonGroupsResponse } from '@/interfaces/lessons/lesson-group';
import type { IAddLessonsToGroupPayload, ICreateLessonSeriesPayload } from '@/interfaces/lessons/lesson';
import type { IDictionaryItem } from '@/interfaces/dictionaries/dictionary-items';
import { apiClient } from '../axios';

export enum LessonGroupsQueryKey {
  AdminList = 'lessonGroupsAdminList',
  My = 'lessonGroupsMy',
};

class LessonGroupsService {
  /** A new group with a lesson at each of the dates */
  static async createLessonSeries(payload: ICreateLessonSeriesPayload): Promise<unknown> {
    return apiClient.post('/lessons-groups/with-lessons', payload);
  }

  /** Groups the current teacher created */
  static async getMyLessonGroups(): Promise<IDictionaryItem[]> {
    return apiClient.get('/lessons-groups/my');
  }

  /** Lessons into an existing group at each of the dates */
  static async addLessonsToGroup(lessonGroupId: string, payload: IAddLessonsToGroupPayload): Promise<unknown> {
    return apiClient.post(`/lessons-groups/${lessonGroupId}/lessons`, payload);
  }

  static async getAdminLessonGroups(params: ILessonGroupsListParams): Promise<ILessonGroupsResponse> {
    return apiClient.get('/admin/lessons-groups', { params, });
  }
}

export default LessonGroupsService;
