'use client';

import { useMemo, useState } from 'react';
import dayjs from '@/lib/dayjs';
import { LESSONS_VIEWS } from '@/configs/lessons-views.config';
import useLessonsFiltersParams from '@/hooks/lessons/useLessonsFiltersParams';
import { toLessonsParams } from '@/lib/lessons-filters';
import type { ILessonsBrowserProps } from '@/interfaces/lessons/filters';
import Switch from '@/components/ui/Switch';
import LessonsToolbar from '../LessonsToolbar';
import LessonsTable from '../LessonsTable';
import QuerySyncedCalendar from '../QuerySyncedCalendar';

import styles from './styles.module.scss';

const LessonsBrowser = ({ view, mode = 'calendar', }: ILessonsBrowserProps) => {
  const filterKeys = LESSONS_VIEWS[view].filters;
  const { filters, search, setFilters, setSearch, } = useLessonsFiltersParams(filterKeys);
  const [includePast, setIncludePast] = useState(false);

  const listParams = useMemo(() => ({
    ...toLessonsParams(filters, search),
    ...(includePast ? {} : { dateFrom: dayjs().startOf('day').toISOString(), }),
  }), [filters, search, includePast]);

  // back to the first page whenever the query changes, without an effect
  const paramsKey = JSON.stringify(listParams);
  const [pageState, setPageState] = useState({ key: paramsKey, page: 1, });
  const page = pageState.key === paramsKey ? pageState.page : 1;

  return (
    <div className={styles.browser}>
      <LessonsToolbar
        filterKeys={filterKeys}
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFiltersApply={setFilters}
      >
        {mode === 'list' && (
          <Switch
            checked={includePast}
            onChange={setIncludePast}
            label={'Include past lessons'}
          />
        )}
      </LessonsToolbar>
      {mode === 'calendar'
        ? <QuerySyncedCalendar view={view} filters={filters} search={search} />
        : (
          <LessonsTable
            view={view}
            params={listParams}
            page={page}
            onPageChange={(next) => setPageState({ key: paramsKey, page: next, })}
          />
        )}
    </div>
  );
}

export default LessonsBrowser;
