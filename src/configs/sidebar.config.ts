import type { INavbarItem } from '../interfaces/layout/sidebar';
import { FaCalendarAlt } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { FaGear } from 'react-icons/fa6';

export const SIDEBAR_ITEMS: INavbarItem[] = [
  {
    href: '/',
    label: 'Home',
    exactPath: true,
    icon: GoHomeFill({}),
  },
  {
    label: "Study Schedule",
    href: "/schedule",
    icon: FaCalendarAlt({}),
  },
  {
    label: 'Parameters',
    href: '/parameters',
    icon: FaGear({}),
    isAuthenticated: true,
  }
] as const;
