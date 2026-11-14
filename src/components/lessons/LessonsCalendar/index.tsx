'use client';

import { useState } from 'react';
import dayjs from '@/lib/dayjs';
import Calendar from '@/components/ui/Calendar';
import { cn } from '@/lib/cn';
import { startOfWeek } from '@/lib/calendar-grid';
import type { ILesson } from '@/interfaces/lessons/lesson';
import type { ILessonsCalendarProps } from '@/interfaces/lessons/calendar';
import LessonDetailsModal from '../LessonDetailsModal';
import WeekLessonsModal from '../WeekLessonsModal';

import styles from './styles.module.scss';

type TDetailsState = { isOpen: boolean; lesson: ILesson | null };
type TWeekState = { isOpen: boolean; day: Date | null };

const LessonsCalendar = ({ events, isFetching, onEdit, onSlotSelect, ...props }: ILessonsCalendarProps) => {
  // the lesson / day is kept after closing so the modal keeps its content during the exit animation
  const [details, setDetails] = useState<TDetailsState>({ isOpen: false, lesson: null, });
  const [week, setWeek] = useState<TWeekState>({ isOpen: false, day: null, });
  const isMonth = props.view === 'month';
  const lessons = events.map((event) => event.resource).filter((lesson): lesson is ILesson => !!lesson);

  // the modal closes first, then the form opens for the lesson
  const editFromModal = (lesson: ILesson, close: () => void) => {
    close();
    onEdit?.(lesson);
  };

  // month view: a click on a day opens its week; the other views create a lesson there (when allowed)
  const selectSlot = isMonth
    ? ({ start, }: { start: Date }) => setWeek({ isOpen: true, day: start, })
    : onSlotSelect;

  return (
    <>
      <Calendar<ILesson>
        {...props}
        className={cn(styles.calendar, isFetching && styles.fetching)}
        events={events}
        defaultView={'week'}
        onEventClick={(event) => setDetails({ isOpen: true, lesson: event.resource ?? null, })}
        onSlotSelect={selectSlot}
      />
      <LessonDetailsModal
        isOpen={details.isOpen}
        lesson={details.lesson}
        onClose={() => setDetails((prev) => ({ ...prev, isOpen: false, }))}
        onEdit={onEdit && ((lesson) => editFromModal(lesson, () => setDetails((prev) => ({ ...prev, isOpen: false, }))))}
      />
      <WeekLessonsModal
        isOpen={week.isOpen}
        weekStart={week.day ? startOfWeek(dayjs(week.day)).toDate() : null}
        lessons={lessons}
        onClose={() => setWeek((prev) => ({ ...prev, isOpen: false, }))}
        onEdit={onEdit && ((lesson) => editFromModal(lesson, () => setWeek((prev) => ({ ...prev, isOpen: false, }))))}
        onCreate={onSlotSelect && week.day ? () => {
          const day = dayjs(week.day).startOf('day');
          setWeek((prev) => ({ ...prev, isOpen: false, }));
          onSlotSelect({ start: day.toDate(), end: day.add(1, 'day').toDate(), });
        } : undefined}
      />
    </>
  );
};

export default LessonsCalendar;
