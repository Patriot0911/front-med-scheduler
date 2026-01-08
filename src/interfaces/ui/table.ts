import { ReactNode } from 'react';

export interface ITableColumn<T> {
  title: string;
  name: string;
  render?: (row: T, index: number) => ReactNode;
};
export interface ITablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export interface ITableProps<T> {
  columns: ITableColumn<T>[];
  isLoading?: boolean;
  data: T[];
  emptyText?: string
  pagination?: ITablePaginationProps;
  rowKey: keyof T | ((row: T) => string);
  onRowClick?: (row: T) => void;
};
