import dayjs from '@/lib/dayjs';
import type { ILesson } from '@/interfaces/lessons/lesson';
import type { ICalendarEvent, TCalendarView } from '@/interfaces/ui/calendar';

/** The days the calendar shows for a date: the month view also shows the edge weeks of the next / previous month */
export const getCalendarRange = (date: Date, view: TCalendarView) => {
  const day = dayjs(date);
  const [from, to] = view === 'month'
    ? [day.startOf('month').startOf('week'), day.endOf('month').endOf('week')]
    : [day.startOf(view), day.endOf(view)];
  return { dateFrom: from.toISOString(), dateTo: to.toISOString(), };
};

export const getLessonStart = (lesson: ILesson) => dayjs(lesson.delayedDate ?? lesson.date);

export const lessonToCalendarEvent = (lesson: ILesson): ICalendarEvent<ILesson> => {
  const start = getLessonStart(lesson);
  return {
    id: lesson.id,
    title: lesson.name,
    start: start.toDate(),
    end: start.add(lesson.duration, 'minute').toDate(),
    type: 'lesson',
    // shown under the title of large event blocks
    location: lesson.studentGroups.map(({ name, }) => name).join(', ') || undefined,
    host: lesson.teachers.map(({ name, }) => name).join(', ') || undefined,
    description: lesson.note ?? undefined,
    resource: lesson,
  };
};
