import dayjs from 'dayjs';
import { EventProps } from 'react-big-calendar';
import { ICalendarEvent } from '@/interfaces/ui/calendar';

import styles from './styles.module.scss';

const CalendarEvent = ({ event }: EventProps<ICalendarEvent>) => {
  const time = `${dayjs(event.start).format('HH:mm')} – ${dayjs(event.end).format('HH:mm')}`;

  return (
    <div className={styles.event}>
      <span className={styles.title}>{event.title}</span>
      {!event.allDay && <span className={styles.meta}>{time}</span>}
      {event.location && <span className={styles.meta}>{event.location}</span>}
    </div>
  );
};

export default CalendarEvent;
