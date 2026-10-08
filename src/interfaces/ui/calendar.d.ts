import { ReactNode } from 'react';

export type TCalendarView = 'day' | 'week' | 'month';

export type TCalendarEventType = 'lesson' | 'lecture' | 'exam' | 'event';

export interface ICalendarEvent<R = unknown> {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: TCalendarEventType;
  allDay?: boolean;
  location?: string;
  host?: string;
  resource?: R;
};

export interface ICalendarProps<R = unknown> {
  events: ICalendarEvent<R>[];
  view?: TCalendarView;
  defaultView?: TCalendarView;
  views?: TCalendarView[];
  date?: Date;
  defaultDate?: Date;
  onViewChange?: (view: TCalendarView) => void;
  onDateChange?: (date: Date) => void;
  onEventClick?: (event: ICalendarEvent<R>) => void;
  onSlotSelect?: (slot: { start: Date; end: Date }) => void;
  minHour?: number;
  maxHour?: number;
  height?: number | string;
  renderEvent?: (event: ICalendarEvent<R>) => ReactNode;
  className?: string;
};

export interface ICalendarToolbarProps {
  label: string;
  view: TCalendarView;
  views: TCalendarView[];
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
  onViewChange: (view: TCalendarView) => void;
};
