'use client';

import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuCalendar, LuCalendarClock } from 'react-icons/lu';
import dayjs from '@/lib/dayjs';
import type { IDateTimeFieldProps } from '@/interfaces/ui/date-picker';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import DatePicker from '@/components/ui/DatePicker';
import TimePicker from '@/components/ui/TimePicker';
import useFloatingPanel from '@/hooks/shared/useFloatingPanel';

import styles from './styles.module.scss';

const DATE_FORMAT = 'ddd, DD MMM YYYY';
const DATE_TIME_FORMAT = 'ddd, DD MMM YYYY · HH:mm';
const DEFAULT_HOUR = 9;

/** A field that opens a date (and, with `withTime`, time) panel; the panel floats over the page (useFloatingPanel) */
const DateTimeField = ({
  value,
  onChange,
  onBlur,
  withTime = false,
  minuteStep,
  name,
  label,
  hint,
  placeholder = withTime ? 'Pick date and time' : 'Pick a date',
  error,
  touched,
  required,
  disabled,
  hideErrorMessage,
}: IDateTimeFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // the panel edits a working value: a date-only pick keeps the time, an empty field starts at 9:00 today
  const working = value ?? dayjs().hour(DEFAULT_HOUR).minute(0).second(0).millisecond(0).toDate();

  const close = useCallback(() => {
    setIsOpen(false);
    onBlur?.();
  }, [onBlur]);

  useFloatingPanel({ isOpen, anchorRef: fieldRef, panelRef, onClose: close, });

  const toggle = () => {
    if (disabled) return;
    if (isOpen) {
      close();
    } else {
      setIsOpen(true);
    }
  };

  const pickDate = (date: Date) => {
    const day = dayjs(date);
    onChange(dayjs(working).year(day.year()).month(day.month()).date(day.date()).toDate());
    if (!withTime) close();
  };

  return (
    <div ref={fieldRef} className={styles.field}>
      <Input
        name={name}
        label={label}
        hint={hint}
        error={error}
        touched={touched}
        required={required}
        disabled={disabled}
        hideErrorMessage={hideErrorMessage}
        readOnly
        value={value ? dayjs(value).format(withTime ? DATE_TIME_FORMAT : DATE_FORMAT) : ''}
        placeholder={placeholder}
        className={styles.trigger}
        aria-haspopup={'dialog'}
        aria-expanded={isOpen}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (!isOpen) toggle();
          }
        }}
        icon={withTime ? <LuCalendarClock /> : <LuCalendar />}
        iconLabel={withTime ? 'Pick date and time' : 'Pick a date'}
        onIconClick={toggle}
      />
      {isOpen && createPortal(
        <div
          ref={panelRef}
          role={'dialog'}
          aria-label={label ?? placeholder}
          className={styles.panel}
        >
          <div className={styles.pickers}>
            <DatePicker value={working} onChange={pickDate} embedded />
            {withTime && (
              <div className={styles.time}>
                <TimePicker value={working} onChange={onChange} minuteStep={minuteStep} />
              </div>
            )}
          </div>
          {withTime && (
            <div className={styles.footer}>
              <Button variant={'primary'} className={'flex-1'} onClick={close}>
                Done
              </Button>
            </div>
          )}
        </div>,
        document.body,
      )}
    </div>
  );
};

export default DateTimeField;
