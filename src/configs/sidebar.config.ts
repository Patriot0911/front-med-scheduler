import { GrSchedules } from 'react-icons/gr';
import type { SidebarItem } from '../interfaces/layout/sidebar';
import { VscSettingsGear } from 'react-icons/vsc';

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Study Schedule",
    href: "/schedule",
    icon: GrSchedules({}),
  },
  {
    label: "Home",
    href: "/",
    icon: VscSettingsGear({}),
    isAuthenticated: true,
  },
];
