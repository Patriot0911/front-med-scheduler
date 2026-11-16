'use client';

import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import type { ReactNode } from 'react';
import { LuBuilding2, LuCalendar, LuClock, LuHourglass, LuUser, LuUsers } from 'react-icons/lu';
import { cn } from '@/lib/cn';
import { getLessonStart } from '@/lib/lessons-calendar';
import type { ILessonDetailsProps } from '@/interfaces/lessons/modal';

import styles from './styles.module.scss';

interface IDetailRow {
  key: string;
  icon: ReactNode;
  label: string;
  value?: ReactNode;
};

const formatDuration = (minutes: number, t: TFunction<'lessons'>) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return [
    hours && t('details.hours', { count: hours, }),
    rest && t('details.minutes', { count: rest, }),
  ].filter(Boolean).join(' ');
};

const joinNames = (items: { name: string }[]) => items.map(({ name, }) => name).join(', ');

/** Date, people and note of a lesson; used by the details and week modals */
const LessonDetails = ({ lesson, }: ILessonDetailsProps) => {
  const { t, } = useTranslation('lessons');
  const start = getLessonStart(lesson);
  const rows: IDetailRow[] = [
    { key: 'date', icon: <LuCalendar />, label: t('details.date'), value: start.format('ddd, DD MMM YYYY'), },
    {
      key: 'time',
      icon: <LuClock />,
      label: t('details.time'),
      value: `${start.format('HH:mm')} – ${start.add(lesson.duration, 'minute').format('HH:mm')}`,
    },
    { key: 'duration', icon: <LuHourglass />, label: t('details.duration'), value: formatDuration(lesson.duration, t), },
    { key: 'teachers', icon: <LuUser />, label: t('details.teachers'), value: joinNames(lesson.teachers), },
    { key: 'groups', icon: <LuUsers />, label: t('details.groups'), value: joinNames(lesson.studentGroups), },
    { key: 'departments', icon: <LuBuilding2 />, label: t('details.departments'), value: joinNames(lesson.departments), },
  ];

  return (
    <div className={styles.content}>
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
          <span className={styles['description-title']}>{t('details.note')}</span>
          <p className={styles['description-text']}>{lesson.note}</p>
        </div>
      )}
    </div>
  );
};

export default LessonDetails;
