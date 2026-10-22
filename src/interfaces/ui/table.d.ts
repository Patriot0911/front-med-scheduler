import { ReactNode } from 'react';
import { IPaginationProps } from './pagination';

export type TTableRowSize = 'sm' | 'md' | 'lg';

export interface ITableColumn<T> {
  key: string;
  title: ReactNode;
  dataBind?: keyof T;
  render?: (row: T, index: number) => ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
};

export interface TableActionCellProps<T> {
  actions: ITableAction<T>[];
  row: T;
};


export interface ITableBodyProps {
  className?: string;
};

export interface ITableHeaderProps {
  className?: string;
};

export interface ITableAction<T> {
  key: string;
  icon: ReactNode;
  label: string;
  variant?: 'danger' | 'primary';
  disabled?: boolean | ((row: T) => boolean);
  onClick: (row: T) => void;
};

export type ITablePaginationProps = IPaginationProps;

interface ITableBaseProps<T> {
  columns: ITableColumn<T>[];
  actions?: ITableAction<T>[];
  data: T[];
  rowKey: keyof T | ((row: T) => string);
  isLoading?: boolean;
  skeletonRows?: number;
  emptyText?: ReactNode;
  emptyComponent?: ReactNode;
  loadingComponent?: ReactNode;
  onRowClick?: (row: T) => void;
  /** Row density: sm – one text line, md – a line of chips (default), lg – two text lines */
  rowSize?: TTableRowSize;
  className?: string;
  children: ReactNode;
};

/**
 * `pageSize` is the one page size of the table: the body is padded with empty rows up to it
 * (so the height stays fixed) and pagination counts pages by it. Pagination requires it.
 */
export type ITableProps<T> = ITableBaseProps<T> & (
  | { pageSize?: number; pagination?: never }
  | { pageSize: number; pagination?: Omit<ITablePaginationProps, 'pageSize'> }
);

export interface ITableContext<T = unknown> {
  columns: ITableColumn<T>[];
  actions?: ITableAction<T>[];
  data: T[];
  isLoading: boolean;
  skeletonRows: number;
  pageSize: number;
  rowKey: keyof T | ((row: T) => string);
  onRowClick?: (row: T) => void;
  emptyText?: ReactNode;
  emptyComponent?: ReactNode;
  loadingComponent?: ReactNode;
};
