export interface INavbarItem {
  label: string;
  href: string;
  exactPath?: boolean;
  icon?: React.ReactNode;
  permissions?: string[];
  isAuthenticated?: boolean;
};

export interface ISidebarHeaderProps {
  isOpen: boolean;
  changeOpen: () => void;
};
