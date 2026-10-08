'use client';

import LessonsSection from '@/components/lessons/LessonsSection';
import useCalendarSearchParams from '@/hooks/calendar/useCalendarSearchParams';
import { IQuerySyncedCalendarProps } from '@/interfaces/lessons/calendar';

const QuerySyncedCalendar = ({ height }: IQuerySyncedCalendarProps) => {
  const { date, view, setDate, setView } = useCalendarSearchParams();

  return (
    <LessonsSection
      height={height}
      date={date}
      view={view}
      onDateChange={setDate}
      onViewChange={setView}
    />
  );
};

export default QuerySyncedCalendar;
