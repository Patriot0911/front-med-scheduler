import { ITableContext } from '@/interfaces/ui/table';
import { createContext, useContext } from 'react';

export const TableContext = createContext<ITableContext<any> | null>(null);

export const useTableContext = <T,>() => {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('useTableContext must be used within Table');
  return ctx as ITableContext<T>;
};
