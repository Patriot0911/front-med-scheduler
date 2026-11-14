import type { ParseKeys } from 'i18next';
import type { Permission } from '../auth/permission';
import type { IAuthUser } from '../auth/user';

export interface INavAccess {
  user: IAuthUser | null;
  hasAny: (permissions: Permission[]) => boolean;
};

export type TNavLabelKey = ParseKeys<'layout'>;

export interface INavbarItem {
  label: TNavLabelKey;
  href: string;
  exactPath?: boolean;
  icon?: React.ReactNode;
  isVisible?: (access: INavAccess) => boolean;
};

export interface INavbarGroup {
  key: string;
  label?: TNavLabelKey;
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
  label?: TNavLabelKey;
  items: INavbarItem[];
  isOpen: boolean;
};
