import Pagination from '@/components/ui/Pagination';
import { ITablePaginationProps } from '@/interfaces/ui/table';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

const TablePagination = ({ className, ...props }: ITablePaginationProps) => {
  return (
    <Pagination
      {...props}
      className={cn(styles['table-pagination'], className)}
    />
  );
}

export default TablePagination;
