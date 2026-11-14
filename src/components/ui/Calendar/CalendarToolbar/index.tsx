'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { LuCalendarDays, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import DatePicker from '@/components/ui/DatePicker';
import { ICalendarToolbarProps, TCalendarView } from '@/interfaces/ui/calendar';
import { ITabItem } from '@/interfaces/ui/tabs';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

const CalendarToolbar = ({
  label,
  date,
  view,
  views,
  onNavigate,
  onDateSelect,
  onViewChange,
}: ICalendarToolbarProps) => {
  const { t, } = useTranslation('ui');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const tabsItems: ITabItem<TCalendarView>[] = views.map((v) => ({
    key: v,
    data: v,
    label: t(`calendar.views.${v}`),
  }));

  useEffect(() => {
    if (!isPickerOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!pickerRef.current?.contains(e.target as Node)) setIsPickerOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPickerOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isPickerOpen]);

  return (
    <div className={styles.toolbar}>
      <div className={styles.navigation}>
        <Button
          variant="secondary"
          className={styles['today-btn']}
          onClick={() => onNavigate('TODAY')}
        >
          {t('calendar.today')}
        </Button>
        <button
          type="button"
          aria-label={t('previous')}
          className={cn(styles['arrow-btn'], styles.prev)}
          onClick={() => onNavigate('PREV')}
        >
          <LuChevronLeft />
        </button>
        <button
          type="button"
          aria-label={t('next')}
          className={cn(styles['arrow-btn'], styles.next)}
          onClick={() => onNavigate('NEXT')}
        >
          <LuChevronRight />
        </button>
        <span className={styles.label}>{label}</span>

        <div ref={pickerRef} className={styles.picker}>
          <button
            type="button"
            aria-label={t('calendar.chooseDate')}
            aria-haspopup="dialog"
            aria-expanded={isPickerOpen}
            className={cn(styles['arrow-btn'], isPickerOpen && styles['arrow-btn__active'])}
            onClick={() => setIsPickerOpen((open) => !open)}
          >
            <LuCalendarDays />
          </button>
          {isPickerOpen && (
            <div role="dialog" aria-label={t('calendar.chooseDate')} className={styles['picker-popover']}>
              <DatePicker
                value={date}
                mode={view}
                onChange={(next) => {
                  onDateSelect(next);
                  setIsPickerOpen(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <Tabs<TCalendarView>
        className={styles['view-tabs']}
        items={tabsItems}
        value={view}
        onChange={onViewChange}
      />
    </div>
  );
};

export default CalendarToolbar;
