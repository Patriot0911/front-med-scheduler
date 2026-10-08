'use client';

import { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Calendar as BigCalendar,
  Components,
  EventPropGetter,
  EventProps,
  NavigateAction,
  ToolbarProps,
  View,
} from 'react-big-calendar';
import CalendarToolbar from './CalendarToolbar';
import CalendarEvent from './CalendarEvent';
import { CALENDAR_CULTURE, calendarFormats, calendarLocalizer } from './localizer';
import { ICalendarEvent, ICalendarProps, TCalendarView } from '@/interfaces/ui/calendar';
import { cn } from '@/lib/cn';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './styles.module.scss';

const DEFAULT_VIEWS: TCalendarView[] = ['day', 'week', 'month'];

const Calendar = <R,>({
  events,
  view: controlledView,
  defaultView = 'week',
  views = DEFAULT_VIEWS,
  date: controlledDate,
  defaultDate,
  onViewChange,
  onDateChange,
  onEventClick,
  onSlotSelect,
  minHour = 7,
  maxHour = 21,
  height = 720,
  renderEvent,
  className,
}: ICalendarProps<R>) => {
  const [innerView, setInnerView] = useState<TCalendarView>(defaultView);
  const [innerDate, setInnerDate] = useState<Date>(() => defaultDate ?? new Date());

  const view = controlledView ?? innerView;
  const date = controlledDate ?? innerDate;

  const handleView = useCallback((next: View) => {
    setInnerView(next as TCalendarView);
    onViewChange?.(next as TCalendarView);
  }, [onViewChange]);

  const handleNavigate = useCallback((next: Date) => {
    setInnerDate(next);
    onDateChange?.(next);
  }, [onDateChange]);

  const { min, max, scrollToTime } = useMemo(() => {
    const today = dayjs().startOf('day');
    return {
      min: today.hour(minHour).toDate(),
      max: today.hour(maxHour).toDate(),
      // keep current time in sight on day/week views
      scrollToTime: dayjs().subtract(1, 'hour').toDate(),
    };
  }, [minHour, maxHour]);

  const components = useMemo<Components<ICalendarEvent<R>>>(() => ({
    toolbar: ({ label, view: tView, onNavigate, onView }: ToolbarProps<ICalendarEvent<R>>) => (
      <CalendarToolbar
        label={label}
        view={tView as TCalendarView}
        views={views}
        onNavigate={(action) => onNavigate(action as NavigateAction)}
        onViewChange={onView}
      />
    ),
    event: renderEvent
      ? ({ event }: EventProps<ICalendarEvent<R>>) => <>{renderEvent(event)}</>
      : (CalendarEvent as Components<ICalendarEvent<R>>['event']),
  }), [views, renderEvent]);

  const eventPropGetter = useCallback<EventPropGetter<ICalendarEvent<R>>>((event) => ({
    className: cn(styles.event, styles[`event-${event.type}`]),
  }), []);

  return (
    <div
      className={cn(styles.calendar, className)}
      style={{ height }}
    >
      <BigCalendar<ICalendarEvent<R>>
        localizer={calendarLocalizer}
        culture={CALENDAR_CULTURE}
        formats={calendarFormats}
        events={events}
        view={view}
        views={views}
        date={date}
        onView={handleView}
        onNavigate={handleNavigate}
        onSelectEvent={onEventClick}
        onSelectSlot={onSlotSelect && (({ start, end }) => onSlotSelect({ start, end }))}
        selectable={!!onSlotSelect}
        min={min}
        max={max}
        scrollToTime={scrollToTime}
        step={30}
        timeslots={2}
        popup
        components={components}
        eventPropGetter={eventPropGetter}
      />
    </div>
  );
};

export default Calendar;
