'use client';

import { useMemo } from 'react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import Calendar from '@/components/ui/Calendar';
import { getMockCalendarEvents } from '@/mocks/calendar-events.mock';

const LessonsCalendar = () => {
  const events = useMemo(() => getMockCalendarEvents(), []);

  return (
    <Calendar
      events={events}
      defaultView="week"
      onEventClick={(event) => toast(`${event.title} · ${dayjs(event.start).format('DD MMM, HH:mm')}`)}
    />
  );
};

export default LessonsCalendar;
