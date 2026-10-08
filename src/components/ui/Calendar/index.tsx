'use client';

import { CSSProperties, useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Calendar as BigCalendar,
  Components,
  EventPropGetter,
  EventProps,
  Messages,
  NavigateAction,
  ToolbarProps,
  View,
} from 'react-big-calendar';
import CalendarToolbar from './CalendarToolbar';
import CalendarEvent from './CalendarEvent';
import { CALENDAR_CULTURE, calendarFormats, calendarLocalizer } from './localizer';
import {
  ICalendarEvent,
  ICalendarProps,
  TCalendarEventDensity,
  TCalendarView,
} from '@/interfaces/ui/calendar';
import { cn } from '@/lib/cn';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './styles.module.scss';

const DEFAULT_VIEWS: TCalendarView[] = ['day', 'week', 'month'];

const STEP_MINUTES = 30;
const EVENT_PADDING_PX = 8;
const EVENT_LINE_PX = 16;

const getEventDensity = (event: ICalendarEvent<unknown>, slotHeight: number): TCalendarEventDensity => {
  const minutes = dayjs(event.end).diff(event.start, 'minute');
  const heightPx = (minutes / STEP_MINUTES) * slotHeight - EVENT_PADDING_PX;
  const lines = Math.floor(heightPx / EVENT_LINE_PX);

  if (lines >= 3) return 'full';
  if (lines === 2) return 'regular';
  return 'compact';
};

const getEventTooltip = (event: ICalendarEvent<unknown>) => [
  event.title,
  event.allDay
    ? 'All day'
    : `${dayjs(event.start).format('HH:mm')} – ${dayjs(event.end).format('HH:mm')}`,
  event.location,
  event.host,
].filter(Boolean).join('\n');

const CALENDAR_MESSAGES: Messages = {
  showMore: (count) => `+${count} more`,
};

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
  slotHeight = 32,
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
      scrollToTime: dayjs().subtract(1, 'hour').toDate(),
    };
  }, [minHour, maxHour]);

  const components = useMemo<Components<ICalendarEvent<R>>>(() => {
    const renderCustom = renderEvent
      && (({ event }: EventProps<ICalendarEvent<R>>) => <>{renderEvent(event)}</>);

    const timeGridEvent = renderCustom
      || ((props: EventProps<ICalendarEvent<R>>) => (
        <CalendarEvent
          {...(props as EventProps<ICalendarEvent>)}
          density={getEventDensity(props.event, slotHeight)}
        />
      ));

    return {
      toolbar: ({ label, view: tView, onNavigate, onView }: ToolbarProps<ICalendarEvent<R>>) => (
        <CalendarToolbar
          label={label}
          view={tView as TCalendarView}
          views={views}
          onNavigate={(action) => onNavigate(action as NavigateAction)}
          onViewChange={onView}
        />
      ),
      event: renderCustom || (CalendarEvent as Components<ICalendarEvent<R>>['event']),
      day: { event: timeGridEvent },
      week: { event: timeGridEvent },
      month: {
        event: renderCustom
          || ((props: EventProps<ICalendarEvent<R>>) => (
            <CalendarEvent {...(props as EventProps<ICalendarEvent>)} density="compact" />
          )),
      },
    };
  }, [views, renderEvent, slotHeight]);

  const eventPropGetter = useCallback<EventPropGetter<ICalendarEvent<R>>>((event) => ({
    className: `event-${event.type}`,
  }), []);

  return (
    <div
      className={cn(styles.calendar, className)}
      style={{ height, '--calendar-slot-height': `${slotHeight}px` } as CSSProperties}
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
        step={STEP_MINUTES}
        timeslots={2}
        popup
        messages={CALENDAR_MESSAGES}
        components={components}
        eventPropGetter={eventPropGetter}
        tooltipAccessor={getEventTooltip}
      />
    </div>
  );
};

export default Calendar;
