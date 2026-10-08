import { useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { IDatePickerProps } from '@/interfaces/ui/date-picker';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const startOfWeek = (date: Dayjs) => date.startOf('day').subtract((date.day() + 6) % 7, 'day');

const getMonthWeeks = (month: Dayjs) => {
  const first = startOfWeek(month.startOf('month'));
  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => first.add(week * 7 + day, 'day'))
  );
};

const DatePicker = ({ value, mode = 'day', onChange, className }: IDatePickerProps) => {
  const selected = dayjs(value);
  const today = dayjs();
  const [viewDate, setViewDate] = useState(() => selected.startOf('month'));

  const unit = mode === 'month' ? 'year' : 'month';
  const weeks = useMemo(() => getMonthWeeks(viewDate), [viewDate]);

  const isSelectedDay = (day: Dayjs) => mode === 'day' && day.isSame(selected, 'day');
  const isSelectedWeek = (week: Dayjs[]) => mode === 'week' && startOfWeek(selected).isSame(week[0], 'day');

  return (
    <div className={cn(styles['date-picker'], className)}>
      <div className={styles.header}>
        <button
          type="button"
          aria-label={`Previous ${unit}`}
          className={styles['nav-btn']}
          onClick={() => setViewDate((d) => d.subtract(1, unit))}
        >
          <LuChevronLeft />
        </button>
        <span className={styles.title}>
          {mode === 'month' ? viewDate.format('YYYY') : viewDate.format('MMMM YYYY')}
        </span>
        <button
          type="button"
          aria-label={`Next ${unit}`}
          className={styles['nav-btn']}
          onClick={() => setViewDate((d) => d.add(1, unit))}
        >
          <LuChevronRight />
        </button>
      </div>

      {mode === 'month' ? (
        <div className={styles.months}>
          {MONTHS.map((label, index) => {
            const month = viewDate.month(index);
            return (
              <button
                key={label}
                type="button"
                className={cn(
                  styles.month,
                  month.isSame(today, 'month') && styles['month__current'],
                  month.isSame(selected, 'month') && styles['month__selected'],
                )}
                onClick={() => onChange(month.startOf('month').toDate())}
              >
                {label}
              </button>
            );
          })}
        </div>
      ) : (
        <div className={cn(styles.grid, mode === 'week' && styles['grid__week'])}>
          <div className={styles.weekdays}>
            {WEEKDAYS.map((day) => (
              <span key={day} className={styles.weekday}>{day}</span>
            ))}
          </div>
          {weeks.map((week) => (
            <div
              key={week[0].valueOf()}
              className={cn(styles.week, isSelectedWeek(week) && styles['week__selected'])}
            >
              {week.map((day) => (
                <button
                  key={day.valueOf()}
                  type="button"
                  className={cn(
                    styles.day,
                    !day.isSame(viewDate, 'month') && styles['day__outside'],
                    day.isSame(today, 'day') && styles['day__today'],
                    isSelectedDay(day) && styles['day__selected'],
                  )}
                  onClick={() => onChange((mode === 'week' ? startOfWeek(day) : day).toDate())}
                >
                  {day.date()}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
