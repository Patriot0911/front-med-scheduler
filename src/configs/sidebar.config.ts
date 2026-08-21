import type { INavbarItem } from '../interfaces/layout/sidebar';
import { IoSchoolSharp } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { IoLibrary } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";

export const SIDEBAR_ITEMS: INavbarItem[] = [
  {
    href: '/',
    label: 'Home',
    exactPath: true,
    icon: GoHomeFill({}),
  },
  {
    label: 'Lessons',
    href: '/lessons',
    icon: IoSchoolSharp({}),
    isAuthenticated: true,
  },
  {
    label: 'Users',
    href: '/users',
    icon: FaUsers({}),
    isAuthenticated: true,
  },
  {
    label: 'Dictionaries',
    href: '/dictionaries',
    icon: IoLibrary({}),
    isAuthenticated: true,
  },
] as const;
