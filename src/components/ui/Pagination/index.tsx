import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { IPaginationProps } from '@/interfaces/ui/pagination';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

type TPageItem = number | 'ellipsis-start' | 'ellipsis-end';

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const getPageItems = (page: number, totalPages: number, siblingCount: number): TPageItem[] => {
  // first + last + current + 2 * siblings + 2 ellipsis slots
  const maxVisible = siblingCount * 2 + 5;
  if (totalPages <= maxVisible) return range(1, totalPages);

  const left = Math.max(page - siblingCount, 1);
  const right = Math.min(page + siblingCount, totalPages);
  const showStartEllipsis = left > 2;
  const showEndEllipsis = right < totalPages - 1;
  const edgeCount = siblingCount * 2 + 3;

  if (!showStartEllipsis) {
    return [...range(1, edgeCount), 'ellipsis-end', totalPages];
  }

  if (!showEndEllipsis) {
    return [1, 'ellipsis-start', ...range(totalPages - edgeCount + 1, totalPages)];
  }

  return [1, 'ellipsis-start', ...range(left, right), 'ellipsis-end', totalPages];
};

const Pagination = ({
  page,
  pageSize,
  total,
  onChange,
  siblingCount = 1,
  showInfo = true,
  disabled = false,
  className,
}: IPaginationProps) => {
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  const from = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, total);
  const items = getPageItems(page, totalPages, siblingCount);

  const goTo = (next: number) => {
    if (disabled || next === page || next < 1 || next > totalPages) return;
    onChange(next);
  };

  return (
    <nav
      aria-label="Pagination"
      className={cn(styles.pagination, className)}
    >
      {showInfo && (
        <span className={styles.info}>
          {from}–{to}
          <span className={styles['info-total']}> / {total}</span>
        </span>
      )}

      <div className={styles.controls}>
        <button
          type="button"
          aria-label="Previous page"
          className={cn(styles.item, styles.arrow)}
          disabled={disabled || page <= 1}
          onClick={() => goTo(page - 1)}
        >
          <LuChevronLeft />
        </button>

        {items.map((item) =>
          typeof item === 'number' ? (
            <button
              key={item}
              type="button"
              aria-current={item === page ? 'page' : undefined}
              className={cn(styles.item, item === page && styles['item__active'])}
              disabled={disabled}
              onClick={() => goTo(item)}
            >
              {item}
            </button>
          ) : (
            <span key={item} className={styles.ellipsis}>…</span>
          )
        )}

        <button
          type="button"
          aria-label="Next page"
          className={cn(styles.item, styles.arrow)}
          disabled={disabled || page >= totalPages}
          onClick={() => goTo(page + 1)}
        >
          <LuChevronRight />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
