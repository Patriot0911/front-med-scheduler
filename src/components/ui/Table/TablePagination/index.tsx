
import { ITablePaginationProps } from '@/interfaces/ui/table';

import styles from './styles.module.scss';

const TablePagination = ({ page, pageSize, total, onChange }: ITablePaginationProps) => {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return;

  return (
    <div className={styles['pagination']}>
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Prev
      </button>

      <span>
        {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default TablePagination;
