import type { ILessonGroupsListParams, ILessonGroupsResponse } from '@/interfaces/lessons/lesson-group';
import { apiClient } from '../axios';

export enum LessonGroupsQueryKey {
  AdminList = 'lessonGroupsAdminList',
};

class LessonGroupsService {
  static async getAdminLessonGroups(params: ILessonGroupsListParams): Promise<ILessonGroupsResponse> {
    return apiClient.get('/admin/lessons-groups', { params, });
  }
}

export default LessonGroupsService;
