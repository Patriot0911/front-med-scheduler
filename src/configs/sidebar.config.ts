import type { INavbarItemsGroup, INavbarItem } from '../interfaces/layout/sidebar';
import { RiHome3Line } from 'react-icons/ri';
import { GrSchedules } from 'react-icons/gr';
import { FaGear } from 'react-icons/fa6';

export const SIDEBAR_HOME: INavbarItem = {
  href: '/',
  label: 'Home',
  icon: RiHome3Line({}),
};
export const SIDEBAR_SETTINGS : INavbarItem = {
  href: '/settings',
  label: 'Settings',
  icon: FaGear({}),
  isAuthenticated: true,
};

export const SIDEBAR_GROUPS: INavbarItemsGroup[] = [
  {
    label: 'Schedules',
    isAuthenticated: false,
    items: [
      {
        label: "Study Schedule",
        href: "/schedule",
        icon: GrSchedules({}),
      },
    ],
  },
  {
    label: 'Admin panel',
    isAuthenticated: true,
    items: [],
  },
];
