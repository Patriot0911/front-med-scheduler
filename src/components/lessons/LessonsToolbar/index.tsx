'use client';

import { useCallback, useEffect, useState } from 'react';
import { LuFilter, LuSearch, LuX } from 'react-icons/lu';
import { cn } from '@/lib/cn';
import { countActiveFilters } from '@/lib/lessons-filters';
import useDebouncedValue from '@/hooks/shared/useDebouncedValue';
import type { ILessonsToolbarProps } from '@/interfaces/lessons/filters';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import LessonsFiltersModal from '../LessonsFiltersModal';

import styles from './styles.module.scss';

const LessonsToolbar = ({
  filterKeys,
  search,
  onSearchChange,
  filters,
  onFiltersApply,
  children,
}: ILessonsToolbarProps) => {
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebouncedValue(searchInput.trim());
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const activeCount = countActiveFilters(filters, filterKeys);
  const closeFilters = useCallback(() => setIsFiltersOpen(false), []);

  useEffect(() => {
    if (debouncedSearch !== search) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, search, onSearchChange]);

  return (
    <div className={cn(styles.toolbar, 'fields-compact')}>
      <div className={styles.row}>
        <div className={styles.search}>
          <Input
            name={'lessons-search'}
            value={searchInput}
            placeholder={'Search lessons, courses, teachers, groups…'}
            aria-label={'Search lessons'}
            onChange={(e) => setSearchInput(e.target.value)}
            icon={searchInput ? <LuX /> : <LuSearch />}
            onIconClick={() => setSearchInput('')}
            hideErrorMessage
          />
        </div>
        <Button
          variant={activeCount > 0 ? 'primary' : 'secondary'}
          leftIcon={<LuFilter />}
          aria-haspopup={'dialog'}
          onClick={() => setIsFiltersOpen(true)}
          className={styles['filters-button']}
        >
          Filters
          {activeCount > 0 && <span className={styles.count}>{activeCount}</span>}
        </Button>
        {children}
      </div>
      <LessonsFiltersModal
        isOpen={isFiltersOpen}
        onClose={closeFilters}
        filterKeys={filterKeys}
        filters={filters}
        onApply={onFiltersApply}
      />
    </div>
  );
}

export default LessonsToolbar;
