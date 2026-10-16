import type { IGroupTag, IGroupTagPayload, IGroupTagResponse } from '@/interfaces/dictionaries/group-tags';
import type { IFilterParams } from '@/interfaces/shared/services';
import { apiClient } from '../axios';

export enum GroupTagsQueryKey {
  GroupTagsList = 'groupTagsList',
};

class GroupTagsService {
  static async getGroupTags(params: IFilterParams = { page: 1, pageSize: 20 }): Promise<IGroupTagResponse> {
    return apiClient.get('/group-tags', { params, });
  }

  static async createGroupTag(payload: IGroupTagPayload): Promise<IGroupTag> {
    return apiClient.post('/group-tags', payload);
  }

  static async editGroupTag(id: string, payload: IGroupTagPayload): Promise<boolean> {
    return apiClient.put(`/group-tags/${id}`, payload);
  }

  static async deleteGroupTag(id: string): Promise<IGroupTag> {
    return apiClient.delete(`/group-tags/${id}`);
  }
}

export default GroupTagsService;
