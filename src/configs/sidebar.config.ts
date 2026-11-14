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
        label: 'nav.overview',
        exactPath: true,
        icon: GoHomeFill({}),
      },
    ],
  },
  {
    key: 'schedule',
    label: 'nav.groups.schedule',
    items: [
      {
        href: '/dashboard/lessons',
        label: 'nav.allLessons',
        icon: IoCalendarSharp({}),
      },
      {
        href: '/dashboard/study',
        label: 'nav.studying',
        icon: IoSchoolSharp({}),
        isVisible: isStudent,
      },
      {
        href: '/dashboard/teaching',
        label: 'nav.teaching',
        icon: FaChalkboardUser({}),
        isVisible: isTeacher,
      },
    ],
  },
  {
    key: 'administration',
    label: 'nav.groups.administration',
    items: [
      {
        href: '/dashboard/admin/lessons',
        label: 'nav.lessons',
        icon: MdEditCalendar({}),
        isVisible: ({ hasAny, }) => hasAny(LESSONS_ADMIN_READ_PERMISSIONS),
      },
      {
        href: '/dashboard/users',
        label: 'nav.users',
        icon: FaUsers({}),
        isVisible: ({ hasAny, }) => hasAny(USERS_READ_PERMISSIONS),
      },
      {
        href: '/dashboard/dictionaries',
        label: 'nav.dictionaries',
        icon: IoLibrary({}),
        isVisible: ({ hasAny, }) => hasAny(DICTIONARIES_READ_PERMISSIONS),
      },
    ],
  },
];
