'use client';

import { LuSearch, LuX } from 'react-icons/lu';
import { cn } from '@/lib/cn';
import { useSelectContext } from '../../context';
import { ISelectSearchProps } from '@/interfaces/ui/selectors';

import styles from './styles.module.scss';

/** Search field pinned to the top of the dropdown (`Select.Area`). */
const SelectSearch = ({ className, placeholder = 'Search...' }: ISelectSearchProps) => {
  const { isOpen, searchable, search, setSearch } = useSelectContext();

  if (!isOpen || !searchable) return null;

  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={styles.field}>
        <LuSearch size={14} className={styles.icon} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          placeholder={placeholder}
          className={styles.search}
          autoFocus
        />
        {search && (
          <button
            type="button"
            className={styles.clear}
            aria-label={'Clear search'}
            onClick={() => setSearch('')}
          >
            <LuX size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SelectSearch;
