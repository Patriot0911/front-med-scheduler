'use client';

import { useState } from 'react';
import Calendar from '@/components/ui/Calendar';
import { cn } from '@/lib/cn';
import type { ILesson } from '@/interfaces/lessons/lesson';
import type { ILessonsCalendarProps } from '@/interfaces/lessons/calendar';
import LessonDetailsModal from '../LessonDetailsModal';

import styles from './styles.module.scss';

type TDetailsState = { isOpen: boolean; lesson: ILesson | null };

const LessonsCalendar = ({ events, isFetching, ...props }: ILessonsCalendarProps) => {
  // the lesson is kept after closing so the modal keeps its content during the exit animation
  const [details, setDetails] = useState<TDetailsState>({ isOpen: false, lesson: null, });

  return (
    <>
      <Calendar<ILesson>
        {...props}
        className={cn(styles.calendar, isFetching && styles.fetching)}
        events={events}
        defaultView={'week'}
        onEventClick={(event) => setDetails({ isOpen: true, lesson: event.resource ?? null, })}
      />
      <LessonDetailsModal
        isOpen={details.isOpen}
        lesson={details.lesson}
        onClose={() => setDetails((prev) => ({ ...prev, isOpen: false, }))}
      />
    </>
  );
};

export default LessonsCalendar;
