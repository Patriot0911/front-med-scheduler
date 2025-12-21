export interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  permissions?: string[];
  isAuthenticated?: boolean;
};
