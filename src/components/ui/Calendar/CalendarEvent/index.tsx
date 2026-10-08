import dayjs from 'dayjs';
import { EventProps } from 'react-big-calendar';
import { ICalendarEvent, TCalendarEventDensity } from '@/interfaces/ui/calendar';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

interface ICalendarEventProps extends EventProps<ICalendarEvent> {
  density?: TCalendarEventDensity;
};

const CalendarEvent = ({ event, density = 'full' }: ICalendarEventProps) => {
  const startTime = dayjs(event.start).format('HH:mm');
  const time = `${startTime} – ${dayjs(event.end).format('HH:mm')}`;

  if (density === 'compact') {
    return (
      <div className={cn(styles.event, styles['event__compact'])}>
        {!event.allDay && <span className={styles.time}>{startTime}</span>}
        <span className={styles.title}>{event.title}</span>
      </div>
    );
  }

  return (
    <div className={styles.event}>
      <span className={styles.title}>{event.title}</span>
      {!event.allDay && <span className={styles.meta}>{time}</span>}
      {density === 'full' && event.location && (
        <span className={styles.meta}>{event.location}</span>
      )}
    </div>
  );
};

export default CalendarEvent;
