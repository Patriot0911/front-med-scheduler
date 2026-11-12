import { LuLock } from 'react-icons/lu';
import { TableActionCellProps } from '@/interfaces/ui/table';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

const TableActionCell = <T,>({ actions, row, lockReason }: TableActionCellProps<T>) => {
  return (
    <td className={styles.td}>
      <div className={styles.cell}>
        {lockReason && (
          <span className={styles.lock} title={lockReason} role="img" aria-label={lockReason}>
            <LuLock />
          </span>
        )}
        {actions.map((action) => {
          const isDisabled = !!lockReason || (
            typeof action.disabled === 'function'
              ? action.disabled(row)
              : (action.disabled ?? false)
          );

          return (
            <button
              key={action.key}
              type="button"
              aria-label={action.label}
              title={lockReason ?? action.label}
              disabled={isDisabled}
              className={cn(
                styles.btn,
                action.variant === 'danger'  && styles['btn-danger'],
                action.variant === 'primary' && styles['btn-primary'],
              )}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(row);
              }}
            >
              {action.icon}
            </button>
          );
        })}
      </div>
    </td>
  );
}

export default TableActionCell;
