import type { INavbarItem } from '../interfaces/layout/sidebar';
import { IoSchoolSharp } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import { IoLibrary } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";

export const SIDEBAR_ITEMS: INavbarItem[] = [
  {
    href: '/dashboard',
    label: 'Overview',
    exactPath: true,
    icon: GoHomeFill({}),
  },
  {
    label: 'Lessons',
    href: '/dashboard/lessons',
    icon: IoSchoolSharp({}),
    isAuthenticated: true,
  },
  {
    label: 'Users',
    href: '/dashboard/users',
    icon: FaUsers({}),
    isAuthenticated: true,
  },
  {
    label: 'Dictionaries',
    href: '/dashboard/dictionaries',
    icon: IoLibrary({}),
    isAuthenticated: true,
  },
] as const;
