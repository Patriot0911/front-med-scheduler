'use client';

import { LESSONS_VIEWS } from '@/configs/lessons-views.config';
import useLessonsFiltersParams from '@/hooks/lessons/useLessonsFiltersParams';
import type { ILessonsBrowserProps } from '@/interfaces/lessons/filters';
import LessonsToolbar from '../LessonsToolbar';
import QuerySyncedCalendar from '../QuerySyncedCalendar';

import styles from './styles.module.scss';

const LessonsBrowser = ({ view, }: ILessonsBrowserProps) => {
  const filterKeys = LESSONS_VIEWS[view].filters;
  const { filters, search, setFilters, setSearch, } = useLessonsFiltersParams(filterKeys);

  return (
    <div className={styles.browser}>
      <LessonsToolbar
        filterKeys={filterKeys}
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFiltersApply={setFilters}
      />
      <QuerySyncedCalendar />
    </div>
  );
}

export default LessonsBrowser;
