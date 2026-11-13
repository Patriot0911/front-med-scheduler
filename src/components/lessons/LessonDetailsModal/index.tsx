'use client';

import type { ReactNode } from 'react';
import { LuBuilding2, LuCalendar, LuClock, LuHistory, LuHourglass, LuUser, LuUsers } from 'react-icons/lu';
import dayjs from '@/lib/dayjs';
import { cn } from '@/lib/cn';
import { getLessonStart } from '@/lib/lessons-calendar';
import { LessonVisibility } from '@/interfaces/lessons/lesson';
import type { ILessonDetailsModalProps } from '@/interfaces/lessons/modal';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

import styles from './styles.module.scss';

interface IDetailRow {
  key: string;
  icon: ReactNode;
  label: string;
  value?: ReactNode;
};

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return [hours && `${hours} h`, rest && `${rest} min`].filter(Boolean).join(' ');
};

const joinNames = (items: { name: string }[]) => items.map(({ name, }) => name).join(', ');

const LessonDetailsModal = ({ lesson, ...props }: ILessonDetailsModalProps) => {
  const start = lesson ? getLessonStart(lesson) : null;
  const rows: IDetailRow[] = lesson && start
    ? [
      { key: 'date', icon: <LuCalendar />, label: 'Date', value: start.format('dddd, DD MMMM YYYY'), },
      {
        key: 'time',
        icon: <LuClock />,
        label: 'Time',
        value: `${start.format('HH:mm')} – ${start.add(lesson.duration, 'minute').format('HH:mm')}`,
      },
      { key: 'duration', icon: <LuHourglass />, label: 'Duration', value: formatDuration(lesson.duration), },
      ...(lesson.delayedDate
        ? [{
          key: 'original',
          icon: <LuHistory />,
          label: 'Moved from',
          value: dayjs(lesson.date).format('DD MMMM YYYY, HH:mm'),
        }]
        : []),
      { key: 'teachers', icon: <LuUser />, label: 'Teachers', value: joinNames(lesson.teachers), },
      { key: 'groups', icon: <LuUsers />, label: 'Groups', value: joinNames(lesson.studentGroups), },
      { key: 'department', icon: <LuBuilding2 />, label: 'Department', value: lesson.departmentName, },
    ]
    : [];

  return (
    <Modal {...props} size={'md'}>
      {lesson && (
        <>
          <Modal.Header title={lesson.name} description={lesson.lessonGroupName} />
          <Modal.Content>
            <div className={styles.content}>
              <div className={styles.badges}>
                <span className={cn(styles.badge, lesson.visibility === LessonVisibility.Involved && styles['badge__involved'])}>
                  {lesson.visibility === LessonVisibility.Involved ? 'Participants only' : 'Public'}
                </span>
                {lesson.delayedDate && (
                  <span className={cn(styles.badge, styles['badge__moved'])}>Moved</span>
                )}
              </div>

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

              {!!lesson.note && (
                <div className={styles.description}>
                  <span className={styles['description-title']}>Note</span>
                  <p className={styles['description-text']}>{lesson.note}</p>
                </div>
              )}
            </div>
          </Modal.Content>
          <Modal.Footer>
            <Button className={'flex-1'} variant={'secondary'} onClick={props.onClose}>
              Close
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default LessonDetailsModal;
