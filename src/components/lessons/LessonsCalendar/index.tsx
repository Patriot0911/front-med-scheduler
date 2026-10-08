'use client';

import { useMemo, useState } from 'react';
import Calendar from '@/components/ui/Calendar';
import EventDetailsModal from '../EventDetailsModal';
import { ICalendarEvent } from '@/interfaces/ui/calendar';
import { ILessonsCalendarProps } from '@/interfaces/lessons/calendar';
import { getMockCalendarEvents } from '@/mocks/calendar-events.mock';

const LessonsCalendar = (props: ILessonsCalendarProps) => {
  const events = useMemo(() => getMockCalendarEvents(), []);
  const [selectedEvent, setSelectedEvent] = useState<ICalendarEvent | null>(null);
  const [isShownDetailsModal, setIsShownDetailsModal] = useState(false);

  const openDetails = (event: ICalendarEvent) => {
    setSelectedEvent(event);
    setIsShownDetailsModal(true);
  };

  return (
    <>
      <Calendar
        {...props}
        events={events}
        defaultView="week"
        onEventClick={openDetails}
      />
      <EventDetailsModal
        isOpen={isShownDetailsModal}
        event={selectedEvent}
        onClose={() => setIsShownDetailsModal(false)}
      />
    </>
  );
};

export default LessonsCalendar;
