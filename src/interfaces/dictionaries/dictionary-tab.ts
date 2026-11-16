import type { ReactNode } from 'react';

export interface IDictionaryTabItemProps {
  title: string;
  icon: ReactNode;
  isActive: boolean;
};

export interface IDictionaryToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  addLabel: string;
  canManage: boolean;
  onCreate: () => void;
};
