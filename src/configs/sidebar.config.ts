import type { INavAccess, INavbarGroup } from '../interfaces/layout/sidebar';
import { Permission } from '../interfaces/auth/permission';
import { IoCalendarSharp, IoLibrary, IoSchoolSharp } from 'react-icons/io5';
import { GoHomeFill } from 'react-icons/go';
import { FaChalkboardUser, FaUsers } from 'react-icons/fa6';
import { MdEditCalendar } from 'react-icons/md';

const LESSONS_ADMIN_READ_PERMISSIONS = [Permission.READ_LESSONS, Permission.MANAGE_LESSONS, Permission.ADMIN];
const USERS_READ_PERMISSIONS = [Permission.READ_USERS, Permission.MANAGE_USERS, Permission.ADMIN];
// any of the dictionaries' readPermissions in dictionaries.config.tsx
const DICTIONARIES_READ_PERMISSIONS = [
  Permission.READ_DEPARTMENTS,
  Permission.MANAGE_DEPARTMENTS,
  Permission.READ_GROUPS,
  Permission.MANAGE_ROLES,
  Permission.ADMIN,
];

const isStudent = ({ user, }: INavAccess) => !!user?.student;
const isTeacher = ({ user, }: INavAccess) => !!user?.teacher;

export const SIDEBAR_GROUPS: INavbarGroup[] = [
  {
    key: 'main',
    items: [
      {
        href: '/dashboard',
        label: 'Overview',
        exactPath: true,
        icon: GoHomeFill({}),
      },
    ],
  },
  {
    key: 'schedule',
    label: 'Schedule',
    items: [
      {
        href: '/dashboard/lessons',
        label: 'All lessons',
        icon: IoCalendarSharp({}),
      },
      {
        href: '/dashboard/study',
        label: 'Studying',
        icon: IoSchoolSharp({}),
        isVisible: isStudent,
      },
      {
        href: '/dashboard/teaching',
        label: 'Teaching',
        icon: FaChalkboardUser({}),
        isVisible: isTeacher,
      },
    ],
  },
  {
    key: 'administration',
    label: 'Administration',
    items: [
      {
        href: '/dashboard/admin/lessons',
        label: 'Lessons',
        icon: MdEditCalendar({}),
        isVisible: ({ hasAny, }) => hasAny(LESSONS_ADMIN_READ_PERMISSIONS),
      },
      {
        href: '/dashboard/users',
        label: 'Users',
        icon: FaUsers({}),
        isVisible: ({ hasAny, }) => hasAny(USERS_READ_PERMISSIONS),
      },
      {
        href: '/dashboard/dictionaries',
        label: 'Dictionaries',
        icon: IoLibrary({}),
        isVisible: ({ hasAny, }) => hasAny(DICTIONARIES_READ_PERMISSIONS),
      },
    ],
  },
];
