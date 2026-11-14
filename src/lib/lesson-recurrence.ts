import type { Dayjs } from 'dayjs';
import dayjs from '@/lib/dayjs';
import type { TRecurrencePattern } from '@/interfaces/lessons/lesson';

/** The API's limit on lessons in one series */
export const MAX_SERIES_LESSONS = 200;

interface ISeriesRule {
  /** The first lesson: its date opens the range, its time is the time of every lesson */
  start: Date;
  pattern: TRecurrencePattern;
  /** Last day of the range, inclusive (`daily`, `weekly`, `biweekly`) */
  until: Date | null;
  /** 0 = Monday … 6 = Sunday (`weekly`, `biweekly`) */
  weekdays: number[];
  /** Extra days besides the first one (`custom`) */
  customDates: Date[];
};

const weekdayOf = (day: Dayjs) => (day.day() + 6) % 7;
const mondayOf = (day: Dayjs) => day.subtract(weekdayOf(day), 'day').startOf('day');
const atStartTime = (day: Dayjs, start: Dayjs) => day.hour(start.hour()).minute(start.minute()).second(0).millisecond(0);

/**
 * The start of every lesson in the series, sorted, one per day. Stops one past the API limit,
 * so a too long range is reported without walking all of it.
 */
export const buildSeriesDates = ({ start, pattern, until, weekdays, customDates, }: ISeriesRule): Date[] => {
  const first = dayjs(start);
  const days: Dayjs[] = [];

  if (pattern === 'none') {
    days.push(first);
  } else if (pattern === 'custom') {
    days.push(first, ...customDates.map((date) => dayjs(date)));
  } else if (until) {
    const last = dayjs(until).endOf('day');
    const firstMonday = mondayOf(first);
    for (let day = first.startOf('day'); !day.isAfter(last) && days.length <= MAX_SERIES_LESSONS; day = day.add(1, 'day')) {
      const isWeekday = pattern === 'daily' || weekdays.includes(weekdayOf(day));
      const isOnWeek = pattern !== 'biweekly' || Math.round(mondayOf(day).diff(firstMonday, 'day') / 7) % 2 === 0;
      if (isWeekday && isOnWeek) days.push(day);
    }
  }

  const unique = new Map(days.map((day) => [day.format('YYYY-MM-DD'), atStartTime(day, first)]));
  return [...unique.values()]
    .sort((a, b) => a.valueOf() - b.valueOf())
    .map((day) => day.toDate());
};

export const weekdayIndexOf = (date: Date) => weekdayOf(dayjs(date));
