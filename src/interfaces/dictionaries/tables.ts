import { dictionariesConfig } from '@/configs/dictionaries.config';
import { ITableColumn } from '../ui/table';
import { ReactNode } from 'react';

export type TDictionaryKey = keyof typeof dictionariesConfig;

export interface IDictionaryTableProps {
  selectedDictionaryKey: TDictionaryKey;
};

export interface IDictionaryItemTheme<T, K> {
  title: string;
  queryFn: (page: number, search?: string) => Promise<T>;
  queryKey: string;
  columns: ITableColumn<K>[];
  icon: ReactNode;
};
