'use client';

import { useMemo, useState } from 'react';
import Calendar from '@/components/ui/Calendar';
import EventDetailsModal from '../EventDetailsModal';
import { ICalendarEvent } from '@/interfaces/ui/calendar';
import { getMockCalendarEvents } from '@/mocks/calendar-events.mock';

const LessonsCalendar = () => {
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
