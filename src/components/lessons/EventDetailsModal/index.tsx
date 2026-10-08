import { ReactNode } from 'react';
import dayjs from 'dayjs';
import { LuCalendar, LuClock, LuHourglass, LuMapPin, LuUser } from 'react-icons/lu';
import { IEventDetailsModalProps } from '@/interfaces/lessons/modal';
import { CALENDAR_EVENT_TYPE_LABELS } from '@/configs/calendar.config';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

const formatDuration = (start: Date, end: Date) => {
  const minutes = dayjs(end).diff(start, 'minute');
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return [hours && `${hours} h`, rest && `${rest} min`].filter(Boolean).join(' ');
};

interface IDetailRow {
  key: string;
  icon: ReactNode;
  label: string;
  value?: ReactNode;
};

const EventDetailsModal = ({ event, ...props }: IEventDetailsModalProps) => {
  const rows: IDetailRow[] = event
    ? [
      {
        key: 'date',
        icon: <LuCalendar />,
        label: 'Date',
        value: dayjs(event.start).format('dddd, DD MMMM YYYY'),
      },
      {
        key: 'time',
        icon: <LuClock />,
        label: 'Time',
        value: event.allDay
          ? 'All day'
          : `${dayjs(event.start).format('HH:mm')} – ${dayjs(event.end).format('HH:mm')}`,
      },
      {
        key: 'duration',
        icon: <LuHourglass />,
        label: 'Duration',
        value: event.allDay ? undefined : formatDuration(event.start, event.end),
      },
      { key: 'location', icon: <LuMapPin />, label: 'Location', value: event.location },
      { key: 'host', icon: <LuUser />, label: 'Host', value: event.host },
    ]
    : [];

  return (
    <Modal {...props} size="md">
      {event && (
        <>
          <Modal.Header title={event.title} />
          <Modal.Content>
            <div className={styles.content}>
              <span className={cn(styles.badge, styles[`badge__${event.type}`])}>
                {CALENDAR_EVENT_TYPE_LABELS[event.type]}
              </span>

              <dl className={styles.details}>
                {rows.map((row) => (
                  <div key={row.key} className={styles.row}>
                    <dt className={styles.label}>
                      <span className={styles.icon}>{row.icon}</span>
                      {row.label}
                    </dt>
                    <dd className={cn(styles.value, !row.value && styles['value__empty'])}>
                      {row.value || '—'}
                    </dd>
                  </div>
                ))}
              </dl>

              {!!event.description && (
                <div className={styles.description}>
                  <span className={styles['description-title']}>Description</span>
                  <p className={styles['description-text']}>{event.description}</p>
                </div>
              )}
            </div>
          </Modal.Content>
          <Modal.Footer>
            <Button
              className="flex-1"
              variant="secondary"
              onClick={props.onClose}
            >
              Close
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default EventDetailsModal;
