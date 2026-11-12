import TableActionCell from '../TableActionCell';
import { useTableContext } from '../context';
import { ITableBodyProps } from '@/interfaces/ui/table';
import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

export const TableBody = <T,>({ className }: ITableBodyProps) => {
  const {
    columns,
    actions,
    data,
    rowKey,
    isLoading,
    skeletonRows,
    pageSize,
    onRowClick,
    rowLock,
    emptyText,
    emptyComponent,
    loadingComponent,
  } = useTableContext<T>();

  const colSpan = columns.length + (actions?.length ? 1 : 0);

  const getRowKey = (row: T, index: number) =>
    typeof rowKey === 'function'
      ? rowKey(row)
      : String(row[rowKey] ?? index);

  // a single state cell (loading / empty) takes the height of all the rows it replaces
  const stateCellStyle = pageSize > 0
    ? { height: `calc(var(--table-row-height) * ${pageSize})`, }
    : undefined;

  // not real rows: they only keep the table at the height of a full page
  const renderFillerRows = (filledCount: number) =>
    Array.from({ length: Math.max(pageSize - filledCount, 0) }).map((_, index) => (
      <tr key={`filler-${index}`} aria-hidden className={styles['filler-row']}>
        <td colSpan={colSpan} />
      </tr>
    ));

  const getLockReason = (row: T): string | undefined => {
    if (!rowLock?.isLocked(row)) return undefined;
    return typeof rowLock.reason === 'function' ? rowLock.reason(row) : rowLock.reason;
  };

  const getCellValue = (row: T, col: typeof columns[number], index: number): ReactNode => {
    if (col.render) return col.render(row, index);
    if (col.dataBind) return row[col.dataBind] as ReactNode;
    return null;
  };

  if (isLoading) {
    if (loadingComponent) {
      return (
        <tbody className={className}>
          <tr>
            <td colSpan={colSpan} className={styles.state} style={stateCellStyle}>
              {loadingComponent}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className={className}>
        {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
          <tr key={rowIndex} className={styles['skeleton-row']}>
            {columns.map((col) => (
              <td
                key={col.key}
                style={{ width: col.width }}
                className={styles['table-cell']}
              >
                <div className={styles['skeleton-bar']} />
              </td>
            ))}
            {actions?.length ? (
              <td style={{ width: actions.length * 32 + 8 }} />
            ) : null}
          </tr>
        ))}
        {renderFillerRows(skeletonRows)}
      </tbody>
    );
  }

  if (data.length === 0) {
    return (
      <tbody className={className}>
        <tr>
          <td colSpan={colSpan} className={styles.state} style={stateCellStyle}>
            {emptyComponent ?? emptyText ?? 'No data found'}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className={cn(className, styles['body'])}>
      {data.map((row, index) => {
        const lockReason = getLockReason(row);
        const isClickable = !!onRowClick && !lockReason;

        return (
          <tr
            key={getRowKey(row, index)}
            onClick={isClickable ? () => onRowClick(row) : undefined}
            className={cn(isClickable && styles.clickable)}
          >
            {columns.map((col) => (
              <td
                key={col.key}
                style={{ width: col.width }}
                className={cn(
                  styles['table-cell'],
                  col.align && styles[`align-${col.align}`],
                  col.className,
                )}
              >
                {getCellValue(row, col, index)}
              </td>
            ))}
            {actions?.length ? (
              <TableActionCell actions={actions} row={row} lockReason={lockReason} />
            ) : null}
          </tr>
        );
      })}
      {renderFillerRows(data.length)}
    </tbody>
  );
};
