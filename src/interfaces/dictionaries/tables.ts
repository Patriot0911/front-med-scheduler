import type { dictionariesConfig } from '@/configs/dictionaries.config';
import type { ITableColumn } from '../ui/table';
import type { IGenericListResponse } from '../shared/generic-response';
import type { IFilterParams } from '../shared/services';
import type { Permission } from '../auth/permission';
import type { ComponentType, PropsWithChildren, ReactNode } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export type TDictionaryKey = keyof typeof dictionariesConfig;

export interface IDictionaryRow {
  id: string;
};

export interface IDictionaryTableProps {
  selectedDictionaryKey: TDictionaryKey;
  page: number;
  search: string;
  canManage: boolean;
  onPageChange: (page: number) => void;
  onEdit: (item: IDictionaryRow) => void;
  onDelete: (item: IDictionaryRow) => void;
};

/** Props of a dictionary create / edit modal; `item` is null when creating. */
export interface IDictionaryFormModalProps<T extends IDictionaryRow> {
  isOpen: boolean;
  item: T | null;
  onClose: () => void;
};

export interface IDictionaryModalProps<T extends FieldValues> extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  methods: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending: boolean;
  isEdit: boolean;
};

/**
 * One dictionary tab. The table is backed by the module's own CRUD endpoints
 * (e.g. /roles, /semesters), not by the lightweight /dictionaries/* lists.
 */
export interface IDictionaryConfig<T extends IDictionaryRow> {
  /** Tab label */
  title: string;
  /** Singular noun used in buttons and confirmations, e.g. "role" */
  itemName: string;
  description: string;
  icon: ReactNode;
  queryKey: string;
  pageSize: number;
  /** The user needs any of these to see the tab */
  readPermissions: Permission[];
  /** ...and any of these to create / edit / delete */
  managePermissions: Permission[];
  columns: ITableColumn<T>[];
  fetchList: (params: IFilterParams) => Promise<IGenericListResponse<T>>;
  remove: (id: string) => Promise<unknown>;
  /** Extra query keys to refresh after changes (e.g. the matching /dictionaries/* list) */
  relatedQueryKeys?: string[];
  getItemLabel: (item: T) => string;
  deleteWarning?: string;
  FormModal: ComponentType<IDictionaryFormModalProps<T>>;
};
