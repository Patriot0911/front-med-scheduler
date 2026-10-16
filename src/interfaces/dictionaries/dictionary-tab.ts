import type { ReactNode } from 'react';

export interface IDictionaryTabItemProps {
  title: string;
  icon: ReactNode;
  isActive: boolean;
};

export interface IDictionaryToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  itemName: string;
  canManage: boolean;
  onCreate: () => void;
};
