'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import Table from '@/components/ui/Table';
import { cn } from '@/lib/cn';
import { getLessonStart } from '@/lib/lessons-calendar';
import useLessonsQuery from '@/hooks/queries/lessons/useLessonsQuery';
import { LessonVisibility, type ILesson } from '@/interfaces/lessons/lesson';
import type { ILessonsTableProps } from '@/interfaces/lessons/filters';
import type { ITableColumn } from '@/interfaces/ui/table';
import LessonDetailsModal from '../LessonDetailsModal';

import cells from '../cells/styles.module.scss';

export const LESSONS_PAGE_SIZE = 10;

type TDetailsState = { isOpen: boolean; lesson: ILesson | null };

const names = (items: { name: string }[]) => items.map(({ name, }) => name).join(', ');

const emptyCell = <span className={cells.empty}>—</span>;

/** Lesson columns by key, also for other lesson tables (e.g. a lesson group's lessons) */
export const createLessonColumns = (t: TFunction<'lessons'>) => ({
  date: {
    key: 'date',
    title: t('columns.date'),
    width: '10rem',
    render: (lesson) => {
      const start = getLessonStart(lesson);
      return (
        <div className={cells.stack}>
          <span className={cells.primary}>{start.format('ddd, DD.MM.YYYY')}</span>
          <span className={cells.secondary}>
            {start.format('HH:mm')}–{start.add(lesson.duration, 'minute').format('HH:mm')}
          </span>
        </div>
      );
    },
  },
  name: {
    key: 'name',
    title: t('columns.lesson'),
    render: (lesson) => (
      <div className={cells.stack}>
        <span className={cells.primary} title={lesson.name}>{lesson.name}</span>
        {lesson.lessonGroupName && (
          <span className={cells.secondary} title={lesson.lessonGroupName}>{lesson.lessonGroupName}</span>
        )}
      </div>
    ),
  },
  teachers: {
    key: 'teachers',
    title: t('columns.teachers'),
    width: '13rem',
    render: (lesson) => <span className={cells.secondary} title={names(lesson.teachers)}>{names(lesson.teachers)}</span>,
  },
  groups: {
    key: 'groups',
    title: t('columns.groups'),
    width: '11rem',
    render: (lesson) => lesson.studentGroups.length
      ? <span className={cells.secondary} title={names(lesson.studentGroups)}>{names(lesson.studentGroups)}</span>
      : emptyCell,
  },
  departments: {
    key: 'departments',
    title: t('columns.departments'),
    width: '11rem',
    render: (lesson) => lesson.departments.length
      ? <span className={cells.secondary} title={names(lesson.departments)}>{names(lesson.departments)}</span>
      : emptyCell,
  },
  status: {
    key: 'status',
    title: t('columns.status'),
    width: '9rem',
    render: (lesson) => (
      <div className={cells.stack}>
        <span className={cn(cells.badge, lesson.visibility === LessonVisibility.Involved && cells['badge--involved'])}>
          {lesson.visibility === LessonVisibility.Involved ? t('visibility.participants') : t('visibility.public')}
        </span>
      </div>
    ),
  },
}) satisfies Record<string, ITableColumn<ILesson>>;

const LessonsTable = ({ view, params, page, onPageChange, onEdit, }: ILessonsTableProps) => {
  const { t, } = useTranslation('lessons');
  const columns = useMemo(() => Object.values(createLessonColumns(t)), [t]);
  const { data, isLoading, isFetching, } = useLessonsQuery(view, { ...params, page, pageSize: LESSONS_PAGE_SIZE, });
  // the lesson is kept after closing so the modal keeps its content during the exit animation
  const [details, setDetails] = useState<TDetailsState>({ isOpen: false, lesson: null, });

  return (
    <>
      <Table<ILesson>
        columns={columns}
        rowKey={(lesson) => lesson.id}
        data={data?.items ?? []}
        skeletonRows={5}
        isLoading={isLoading}
        emptyText={t('emptyMatch')}
        onRowClick={(lesson) => setDetails({ isOpen: true, lesson, })}
        pageSize={LESSONS_PAGE_SIZE}
        rowSize={'lg'}
        pagination={{
          page,
          total: data?.meta.count ?? 0,
          onChange: onPageChange,
          disabled: isFetching,
        }}
      >
        <Table.Header />
        <Table.Body />
      </Table>
      <LessonDetailsModal
        isOpen={details.isOpen}
        lesson={details.lesson}
        onClose={() => setDetails((prev) => ({ ...prev, isOpen: false, }))}
        onEdit={onEdit && ((lesson) => {
          setDetails((prev) => ({ ...prev, isOpen: false, }));
          onEdit(lesson);
        })}
      />
    </>
  );
}

export default LessonsTable;
