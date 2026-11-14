'use client';

import { useLayoutEffect, useRef } from 'react';
import dayjs from '@/lib/dayjs';
import type { ITimePickerProps } from '@/interfaces/ui/date-picker';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const pad = (value: number) => String(value).padStart(2, '0');

/** Hours and minutes as two scrollable columns; changes only the time of the given date */
const TimePicker = ({ value, onChange, minuteStep = 5, }: ITimePickerProps) => {
  const current = dayjs(value);
  const hour = current.hour();
  const minute = current.minute();
  const ref = useRef<HTMLDivElement>(null);

  const steps = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);
  const minutes = steps.includes(minute) ? steps : [...steps, minute].sort((a, b) => a - b);

  // the selected hour and minute in view when the picker opens
  useLayoutEffect(() => {
    ref.current?.querySelectorAll<HTMLElement>(`.${styles['option__selected']}`)
      .forEach((option) => option.scrollIntoView({ block: 'center', }));
  }, []);

  return (
    <div className={styles['time-picker']} ref={ref}>
      <div className={styles.header}>
        <span className={styles.label}>Time</span>
        <span className={styles.value}>{pad(hour)}:{pad(minute)}</span>
      </div>
      <div className={styles.columns}>
        <div className={styles.column} role={'listbox'} aria-label={'Hours'}>
          {HOURS.map((option) => (
            <button
              key={option}
              type={'button'}
              role={'option'}
              aria-selected={option === hour}
              className={cn(styles.option, option === hour && styles['option__selected'])}
              onClick={() => onChange(current.hour(option).toDate())}
            >
              {pad(option)}
            </button>
          ))}
        </div>
        <div className={styles.column} role={'listbox'} aria-label={'Minutes'}>
          {minutes.map((option) => (
            <button
              key={option}
              type={'button'}
              role={'option'}
              aria-selected={option === minute}
              className={cn(styles.option, option === minute && styles['option__selected'])}
              onClick={() => onChange(current.minute(option).toDate())}
            >
              {pad(option)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
