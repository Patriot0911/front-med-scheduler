import { ReactNode } from 'react';

export interface ITabItem<T extends string = string> {
  key: string;
  data: T;
  label: string;
  isDisabled?: boolean | (() => boolean);
  render?: ((item: T) => ReactNode) | ReactNode;
};

export interface ITabsProps<T extends string = string> {
  items: ITabItem<T>[];
  value: string;
  onChange: (value: T) => void;
  renderItem?: (item: ITabItem<T>) => ReactNode;
  className?: string;
};
