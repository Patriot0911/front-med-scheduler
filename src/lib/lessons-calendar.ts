import dayjs from '@/lib/dayjs';
import { DEFAULT_LESSON_DURATION } from '@/configs/lessons-views.config';
import type { ILesson, ILessonDraft } from '@/interfaces/lessons/lesson';
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

const DAY_MINUTES = 24 * 60;
const SLOT_MINUTES = 30;
const DEFAULT_START_HOUR = 9;

/**
 * A clicked / dragged calendar slot as a new lesson: a whole day (month view) starts at 9:00,
 * a single click keeps the default duration, a dragged range gives its own
 */
export const slotToLessonDraft = ({ start, end, }: { start: Date; end: Date }): ILessonDraft => {
  const from = dayjs(start);
  const minutes = dayjs(end).diff(from, 'minute');
  if (minutes >= DAY_MINUTES) {
    return { start: from.hour(DEFAULT_START_HOUR).minute(0).toDate(), duration: DEFAULT_LESSON_DURATION, };
  }
  return { start: from.toDate(), duration: minutes > SLOT_MINUTES ? minutes : DEFAULT_LESSON_DURATION, };
};

/** A lesson created with the button: the next full hour */
export const nextHourLessonDraft = (): ILessonDraft => ({
  start: dayjs().add(1, 'hour').startOf('hour').toDate(),
  duration: DEFAULT_LESSON_DURATION,
});
