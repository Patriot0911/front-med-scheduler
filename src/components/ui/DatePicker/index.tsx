import { useState } from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from '@/lib/dayjs';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { IDatePickerProps, TDatePickerLevel } from '@/interfaces/ui/date-picker';
import { cn } from '@/lib/cn';
import { startOfWeek } from '@/lib/calendar-grid';
import MonthGrid from '@/components/ui/MonthGrid';

import styles from './styles.module.scss';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const YEARS_PER_PAGE = 12;

const LEVEL_STEP: Record<TDatePickerLevel, { amount: number; unit: 'month' | 'year' }> = {
  days: { amount: 1, unit: 'month' },
  months: { amount: 1, unit: 'year' },
  years: { amount: YEARS_PER_PAGE, unit: 'year' },
};

const UPPER_LEVEL: Partial<Record<TDatePickerLevel, TDatePickerLevel>> = {
  days: 'months',
  months: 'years',
};

const getYearsPageStart = (year: number) => Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE;

const DatePicker = ({ value, mode = 'day', onChange, embedded, className }: IDatePickerProps) => {
  const selected = dayjs(value);
  const today = dayjs();
  const baseLevel: TDatePickerLevel = mode === 'month' ? 'months' : 'days';

  const [level, setLevel] = useState<TDatePickerLevel>(baseLevel);
  const [viewDate, setViewDate] = useState(() => selected.startOf('month'));

  const yearsPageStart = getYearsPageStart(viewDate.year());
  const upperLevel = UPPER_LEVEL[level];

  const title = {
    days: viewDate.format('MMMM YYYY'),
    months: viewDate.format('YYYY'),
    years: `${yearsPageStart} – ${yearsPageStart + YEARS_PER_PAGE - 1}`,
  }[level];

  const shiftView = (direction: 1 | -1) => {
    const { amount, unit } = LEVEL_STEP[level];
    setViewDate((d) => d.add(direction * amount, unit));
  };

  const selectYear = (year: number) => {
    setViewDate((d) => d.year(year));
    setLevel('months');
  };

  const selectMonth = (month: Dayjs) => {
    if (mode === 'month') {
      onChange(month.startOf('month').toDate());
      return;
    }
    setViewDate(month.startOf('month'));
    setLevel('days');
  };

  const isSelectedDay = (day: Dayjs) => mode === 'day' && day.isSame(selected, 'day');
  const isSelectedWeek = (week: Dayjs[]) => mode === 'week' && startOfWeek(selected).isSame(week[0], 'day');

  return (
    <div className={cn(styles['date-picker'], embedded && styles['date-picker__embedded'], className)}>
      <div className={styles.header}>
        <button
          type="button"
          aria-label="Previous"
          className={styles['nav-btn']}
          onClick={() => shiftView(-1)}
        >
          <LuChevronLeft />
        </button>
        <button
          type="button"
          className={cn(styles.title, !upperLevel && styles['title__static'])}
          disabled={!upperLevel}
          onClick={() => upperLevel && setLevel(upperLevel)}
        >
          {title}
        </button>
        <button
          type="button"
          aria-label="Next"
          className={styles['nav-btn']}
          onClick={() => shiftView(1)}
        >
          <LuChevronRight />
        </button>
      </div>

      {level === 'years' && (
        <div className={styles.cells}>
          {Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearsPageStart + i).map((year) => (
            <button
              key={year}
              type="button"
              className={cn(
                styles.cell,
                year === today.year() && styles['cell__current'],
                year === selected.year() && styles['cell__selected'],
              )}
              onClick={() => selectYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {level === 'months' && (
        <div className={styles.cells}>
          {MONTHS.map((label, index) => {
            const month = viewDate.month(index);
            return (
              <button
                key={label}
                type="button"
                className={cn(
                  styles.cell,
                  month.isSame(today, 'month') && styles['cell__current'],
                  month.isSame(selected, 'month') && styles['cell__selected'],
                )}
                onClick={() => selectMonth(month)}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {level === 'days' && (
        <MonthGrid
          month={viewDate}
          weekMode={mode === 'week'}
          isDaySelected={isSelectedDay}
          isWeekSelected={isSelectedWeek}
          onDayClick={(day) => onChange((mode === 'week' ? startOfWeek(day) : day).toDate())}
        />
      )}
    </div>
  );
};

export default DatePicker;
