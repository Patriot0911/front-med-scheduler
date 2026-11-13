import type { Permission } from '../auth/permission';
import type { IAuthUser } from '../auth/user';

export interface INavAccess {
  user: IAuthUser | null;
  hasAny: (permissions: Permission[]) => boolean;
};

export interface INavbarItem {
  label: string;
  href: string;
  exactPath?: boolean;
  icon?: React.ReactNode;
  isVisible?: (access: INavAccess) => boolean;
};

export interface INavbarGroup {
  key: string;
  label?: string;
  items: INavbarItem[];
};

export interface ISidebarHeaderProps {
  isOpen: boolean;
};

export interface ISidebarToggleProps {
  isOpen: boolean;
  changeOpen: () => void;
};

export interface ISidebarSectionProps {
  isOpen: boolean;
};

export interface INavLinkProps extends Omit<INavbarItem, 'isVisible'> {
  isOpen: boolean;
};

export interface INavGroupProps {
  label?: string;
  items: INavbarItem[];
  isOpen: boolean;
};
