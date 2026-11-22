import { ITableContext } from '@/interfaces/ui/table';
import { createContext, useContext } from 'react';

// a context cannot be generic: Table erases the row type here and useTableContext<T> restores it
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TableContext = createContext<ITableContext<any> | null>(null);

export const useTableContext = <T,>() => {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('useTableContext must be used within Table');
  return ctx as ITableContext<T>;
};
