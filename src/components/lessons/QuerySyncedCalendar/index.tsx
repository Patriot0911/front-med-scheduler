'use client';

import { useMemo } from 'react';
import { EMPTY_LESSONS_FILTERS } from '@/configs/lessons-views.config';
import useCalendarSearchParams from '@/hooks/calendar/useCalendarSearchParams';
import useLessonsQuery from '@/hooks/queries/lessons/useLessonsQuery';
import { getErrorMessage } from '@/lib/errors';
import { getCalendarRange, lessonToCalendarEvent } from '@/lib/lessons-calendar';
import { toLessonsParams } from '@/lib/lessons-filters';
import type { IQuerySyncedCalendarProps } from '@/interfaces/lessons/calendar';
import LessonsSection from '../LessonsSection';

import styles from './styles.module.scss';

/** The calendar of a lessons view: date / view from the URL, lessons of the visible range */
const QuerySyncedCalendar = ({
  height,
  view: lessonsView,
  filters = EMPTY_LESSONS_FILTERS,
  search = '',
  onSlotSelect,
  onEdit,
}: IQuerySyncedCalendarProps) => {
  const { date, view, setDate, setView, } = useCalendarSearchParams();

  const params = useMemo(
    () => ({ ...toLessonsParams(filters, search), ...getCalendarRange(date, view), }),
    [filters, search, date, view],
  );
  const { data, error, isFetching, } = useLessonsQuery(lessonsView, params);
  const events = useMemo(() => (data?.items ?? []).map(lessonToCalendarEvent), [data]);

  return (
    <div className={styles.wrapper}>
      {error && (
        <p className={styles.error} role={'alert'}>
          Couldn&apos;t load lessons: {getErrorMessage(error)}
        </p>
      )}
      <LessonsSection
        height={height}
        date={date}
        view={view}
        onDateChange={setDate}
        onViewChange={setView}
        events={events}
        isFetching={isFetching}
        onSlotSelect={onSlotSelect}
        onEdit={onEdit}
      />
    </div>
  );
};

export default QuerySyncedCalendar;
