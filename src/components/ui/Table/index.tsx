import { cn } from '@/lib/cn';
import { TableContext } from './context';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import TablePagination from './TablePagination';
import { ITableProps } from '@/interfaces/ui/table';

import styles from './styles.module.scss';

const Table = <T,>({
  columns,
  actions,
  data,
  rowKey,
  isLoading = false,
  skeletonRows = 5,
  pageSize = 0,
  emptyText,
  emptyComponent,
  loadingComponent,
  onRowClick,
  pagination,
  rowSize = 'md',
  className,
  children,
}: ITableProps<T>) => {
  return (
    <TableContext.Provider
      value={{
        columns,
        actions,
        data,
        rowKey,
        isLoading,
        skeletonRows,
        pageSize,
        emptyText,
        emptyComponent,
        loadingComponent,
        onRowClick,
      }}
    >
      <div className={cn(styles['table-wrapper'], styles[`row-${rowSize}`], className)}>
        <div className={styles['table-scroll']}>
          <table className={styles.table}>
            {children}
          </table>
        </div>
        {pagination && (
          <TablePagination
            disabled={isLoading}
            {...pagination}
            pageSize={pageSize}
          />
        )}
      </div>
    </TableContext.Provider>
  );
}

Table.Header = TableHeader;
Table.Body = TableBody;

export default Table;
