import type { Dayjs } from 'dayjs';
import dayjs from '@/lib/dayjs';

// Monday first, in the current dayjs locale
export const getWeekdayLabels = () => Array.from({ length: 7, }, (_, index) => dayjs().day((index + 1) % 7).format('dd'));

/** Monday of the day's week */
export const startOfWeek = (date: Dayjs) => date.startOf('day').subtract((date.day() + 6) % 7, 'day');

/** Six full weeks covering the month, as a month view shows them */
export const getMonthWeeks = (month: Dayjs) => {
  const first = startOfWeek(month.startOf('month'));
  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => first.add(week * 7 + day, 'day'))
  );
};
