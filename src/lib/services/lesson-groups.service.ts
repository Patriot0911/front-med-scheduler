import type { IEditLessonGroupPayload, ILessonGroupsListParams, ILessonGroupsResponse } from '@/interfaces/lessons/lesson-group';
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

  static async editAdminLessonGroup(lessonGroupId: string, payload: IEditLessonGroupPayload): Promise<boolean> {
    return apiClient.put(`/admin/lessons-groups/${lessonGroupId}`, payload);
  }

  /** Without `withLessons` the lessons stay, out of any group */
  static async deleteAdminLessonGroup(lessonGroupId: string, withLessons: boolean): Promise<unknown> {
    return apiClient.delete(`/admin/lessons-groups/${lessonGroupId}`, { params: { withLessons, }, });
  }

  /** Existing lessons into the group, moved from another group or none */
  static async assignAdminLessons(lessonGroupId: string, lessonIds: string[]): Promise<number> {
    return apiClient.put(`/admin/lessons-groups/${lessonGroupId}/lessons`, { lessonIds, });
  }

  /** The lessons stay, without a group */
  static async removeAdminLessons(lessonGroupId: string, lessonIds: string[]): Promise<number> {
    return apiClient.post(`/admin/lessons-groups/${lessonGroupId}/lessons/remove`, { lessonIds, });
  }
}

export default LessonGroupsService;
