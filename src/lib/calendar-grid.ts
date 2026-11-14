import type { Dayjs } from 'dayjs';

export const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/** Monday of the day's week */
export const startOfWeek = (date: Dayjs) => date.startOf('day').subtract((date.day() + 6) % 7, 'day');

/** Six full weeks covering the month, as a month view shows them */
export const getMonthWeeks = (month: Dayjs) => {
  const first = startOfWeek(month.startOf('month'));
  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => first.add(week * 7 + day, 'day'))
  );
};
