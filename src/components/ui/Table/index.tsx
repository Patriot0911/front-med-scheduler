import type { ITableProps } from '@/interfaces/ui/table';
import { cn } from '@/lib/cn';
import TablePagination from './TablePagination';

import styles from './styles.module.scss';

const Table = <T,>({ columns, isLoading, data, emptyText, pagination, rowKey, onRowClick }: ITableProps<T>) => {
  const getRowKey = (row: T, index: number) =>
    typeof rowKey === 'function'
      ? rowKey(row)
      : String(row[rowKey] ?? index);

  return (
    <div className={styles['table-wrapper']}>
      <table className={styles['table']}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.name} className={styles['table-header']}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={columns.length} className={styles['state']}>
                Loading...
              </td>
            </tr>
          )}
          {!isLoading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className={styles['state']}>
                {emptyText ?? 'Cannot find any data'}
              </td>
            </tr>
          )}
          {!isLoading &&
            data.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                onClick={() => onRowClick?.(row)}
                className={cn(onRowClick && styles['clickable'])}
              >
                {columns.map(col => (
                  <td key={String(col.name)} className={styles['tableCell']}>
                    {col.render ? col.render(row, index) : (row as any)[col.name]}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      {pagination && (
        <TablePagination {...pagination} />
      )}
    </div>
  );
}

export default Table;
