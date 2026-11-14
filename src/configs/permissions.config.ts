import type { ParseKeys } from 'i18next';
import { Permission } from '@/interfaces/auth/permission';
import { getGlobalI18n } from '@/i18n/client/i18nRef';

export const PermissionLabels: Record<Permission, ParseKeys<'permissions'>> = {
  [Permission.ADMIN]: 'admin',

  [Permission.READ_GROUPS]: 'readGroups',
  [Permission.MANAGE_GROUPS]: 'manageGroups',

  [Permission.READ_ROLES]: 'readRoles',
  [Permission.MANAGE_ROLES]: 'manageRoles',

  [Permission.READ_USERS]: 'readUsers',
  [Permission.MANAGE_USERS]: 'manageUsers',

  [Permission.READ_LESSONS]: 'readLessons',
  [Permission.MANAGE_LESSONS]: 'manageLessons',

  [Permission.READ_COMMENTS]: 'readComments',
  [Permission.MANAGE_COMMENTS]: 'manageComments',

  [Permission.READ_DEPARTMENTS]: 'readDepartments',
  [Permission.MANAGE_DEPARTMENTS]: 'manageDepartments',
};

export const getPermissionLabel = (permission: string): string => {
  const key = PermissionLabels[permission as Permission];
  return key ? getGlobalI18n().getFixedT(null, 'permissions')(key) : permission;
};
