'use client';

import { useMemo } from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from '@/lib/dayjs';
import { getMonthWeeks, WEEKDAY_LABELS } from '@/lib/calendar-grid';
import type { IMonthGridProps } from '@/interfaces/ui/date-picker';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

/** The days of one month as a 7-column grid; shared by DatePicker and MultiMonthCalendar */
const MonthGrid = ({
  month,
  weekMode = false,
  isDaySelected = () => false,
  isWeekSelected = () => false,
  isDayLocked = () => false,
  isDayDisabled = () => false,
  onDayClick,
  isOutsideDayHidden = () => false,
  shadeOutsideDays = false,
  joinSelectedDays = false,
}: IMonthGridProps) => {
  const weeks = useMemo(() => getMonthWeeks(month), [month]);
  const today = dayjs();
  const isReadOnly = !onDayClick;
  const isChosen = (day: Dayjs) => isDayLocked(day) || isDaySelected(day);

  return (
    <div
      className={cn(
        styles.grid,
        weekMode && styles['grid__week'],
        isReadOnly && styles['grid__readonly'],
        shadeOutsideDays && styles['grid__shaded'],
      )}
    >
      <div className={styles.weekdays}>
        {WEEKDAY_LABELS.map((day) => (
          <span key={day} className={styles.weekday}>{day}</span>
        ))}
      </div>
      {weeks.map((week) => (
        <div
          key={week[0].valueOf()}
          className={cn(styles.week, isWeekSelected(week) && styles['week__selected'])}
        >
          {week.map((day) => {
            const isOutside = !day.isSame(month, 'month');
            if (isOutside && isOutsideDayHidden(day)) {
              return <span key={day.valueOf()} className={styles.blank} aria-hidden />;
            }
            const isSelected = isChosen(day);
            const isLocked = isDayLocked(day);
            // calendar neighbours, not grid cells: a range runs on across weeks (rows) and months
            const joinsPrev = joinSelectedDays && isSelected && isChosen(day.subtract(1, 'day'));
            const joinsNext = joinSelectedDays && isSelected && isChosen(day.add(1, 'day'));
            return (
              <button
                key={day.valueOf()}
                type={'button'}
                aria-pressed={isSelected}
                disabled={isReadOnly || isLocked || isDayDisabled(day)}
                className={cn(
                  styles.day,
                  isOutside && styles['day__outside'],
                  day.isSame(today, 'day') && styles['day__today'],
                  isSelected && styles['day__selected'],
                  isLocked && styles['day__locked'],
                  joinsPrev && styles['day__join-prev'],
                  joinsNext && styles['day__join-next'],
                )}
                onClick={() => onDayClick?.(day)}
              >
                {day.date()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MonthGrid;
