'use client';

import { useMemo, useState } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import type { Dayjs } from 'dayjs';
import dayjs from '@/lib/dayjs';
import type { IMultiMonthCalendarProps } from '@/interfaces/ui/date-picker';
import { cn } from '@/lib/cn';
import MonthGrid from '@/components/ui/MonthGrid';

import styles from './styles.module.scss';

const dayKey = (day: Dayjs | Date) => dayjs(day).format('YYYY-MM-DD');

/** Several months side by side with the chosen days highlighted; with onToggle the days are picked by click */
const MultiMonthCalendar = ({
  selected,
  onToggle,
  lockedDates = [],
  minDate,
  initialMonth,
  months = 2,
  className,
}: IMultiMonthCalendarProps) => {
  const [firstMonth, setFirstMonth] = useState(
    () => dayjs(initialMonth ?? selected[0] ?? new Date()).startOf('month'),
  );
  const selectedKeys = useMemo(() => new Set(selected.map(dayKey)), [selected]);
  const lockedKeys = useMemo(() => new Set(lockedDates.map(dayKey)), [lockedDates]);
  const shownMonths = Array.from({ length: months, }, (_, index) => firstMonth.add(index, 'month'));

  return (
    <div className={cn(styles.calendar, className)}>
      <div className={styles.months}>
        {shownMonths.map((month, index) => (
          <div key={month.valueOf()} className={styles.month}>
            <div className={styles.header}>
              {index === 0
                ? (
                  <button
                    type={'button'}
                    aria-label={'Previous month'}
                    className={styles['nav-btn']}
                    onClick={() => setFirstMonth((current) => current.subtract(1, 'month'))}
                  >
                    <LuChevronLeft />
                  </button>
                )
                : <span className={styles['nav-gap']} />}
              <span className={styles.title}>{month.format('MMMM YYYY')}</span>
              {index === shownMonths.length - 1
                ? (
                  <button
                    type={'button'}
                    aria-label={'Next month'}
                    className={styles['nav-btn']}
                    onClick={() => setFirstMonth((current) => current.add(1, 'month'))}
                  >
                    <LuChevronRight />
                  </button>
                )
                : <span className={styles['nav-gap']} />}
            </div>
            <MonthGrid
              month={month}
              shadeOutsideDays
              joinSelectedDays
              isOutsideDayHidden={(day) => shownMonths.some((shown) => day.isSame(shown, 'month'))}
              isDaySelected={(day) => selectedKeys.has(dayKey(day))}
              isDayLocked={(day) => lockedKeys.has(dayKey(day))}
              isDayDisabled={(day) => !!minDate && day.isBefore(minDate, 'day')}
              onDayClick={onToggle && ((day) => onToggle(day.toDate()))}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiMonthCalendar;
