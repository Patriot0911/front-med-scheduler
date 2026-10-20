import { Permission } from '@/interfaces/auth/permission';

export const PermissionLabels: Record<Permission, string> = {
  [Permission.ADMIN]: 'Administrator',

  [Permission.READ_GROUPS]: 'View groups',
  [Permission.MANAGE_GROUPS]: 'Manage groups',

  [Permission.READ_ROLES]: 'View roles',
  [Permission.MANAGE_ROLES]: 'Manage roles',

  [Permission.READ_USERS]: 'View users',
  [Permission.MANAGE_USERS]: 'Manage users',

  [Permission.READ_LESSONS]: 'View lessons',
  [Permission.MANAGE_LESSONS]: 'Manage all lessons',
  [Permission.MANAGE_OWN_LESSONS]: 'Manage own lessons',

  [Permission.READ_COMMENTS]: 'View comments',
  [Permission.MANAGE_COMMENTS]: 'Manage comments',

  [Permission.READ_DEPARTMENTS]: 'View departments',
  [Permission.MANAGE_DEPARTMENTS]: 'Manage departments',
};

export const getPermissionLabel = (permission: string): string =>
  PermissionLabels[permission as Permission] ?? permission;
