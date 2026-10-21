import type { IDictionaryItem, ITeacherDictionaryItem } from '@/interfaces/dictionaries/dictionary-items';
import type { Permission } from '@/interfaces/auth/permission';
import { apiClient } from '../axios';

/** Lightweight `/dictionaries/*` endpoints: options for selects and id → name labels. */
export enum DictionaryQueryKey {
  Permissions = 'dictionaryPermissions',
  GroupTags = 'dictionaryGroupTags',
  Teachers = 'dictionaryTeachers',
  Departments = 'dictionaryDepartments',
};

class DictionariesService {
  static async getPermissions(): Promise<Permission[]> {
    return apiClient.get('/dictionaries/permissions');
  }

  static async getGroupTags(): Promise<IDictionaryItem[]> {
    return apiClient.get('/dictionaries/group-tags');
  }

  static async getTeachers(): Promise<ITeacherDictionaryItem[]> {
    return apiClient.get('/dictionaries/teachers');
  }

  static async getDepartments(): Promise<IDictionaryItem[]> {
    return apiClient.get('/dictionaries/departments');
  }
}

export default DictionariesService;
