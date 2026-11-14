'use client';

import { useState } from 'react';
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

const COLUMNS: ITableColumn<ILesson>[] = [
  {
    key: 'date',
    title: 'Date',
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
  {
    key: 'name',
    title: 'Lesson',
    render: (lesson) => (
      <div className={cells.stack}>
        <span className={cells.primary} title={lesson.name}>{lesson.name}</span>
        {lesson.lessonGroupName && (
          <span className={cells.secondary} title={lesson.lessonGroupName}>{lesson.lessonGroupName}</span>
        )}
      </div>
    ),
  },
  {
    key: 'teachers',
    title: 'Teachers',
    width: '13rem',
    render: (lesson) => <span className={cells.secondary} title={names(lesson.teachers)}>{names(lesson.teachers)}</span>,
  },
  {
    key: 'groups',
    title: 'Groups',
    width: '11rem',
    render: (lesson) => lesson.studentGroups.length
      ? <span className={cells.secondary} title={names(lesson.studentGroups)}>{names(lesson.studentGroups)}</span>
      : emptyCell,
  },
  {
    key: 'departments',
    title: 'Departments',
    width: '11rem',
    render: (lesson) => lesson.departments.length
      ? <span className={cells.secondary} title={names(lesson.departments)}>{names(lesson.departments)}</span>
      : emptyCell,
  },
  {
    key: 'status',
    title: 'Status',
    width: '9rem',
    render: (lesson) => (
      <div className={cells.stack}>
        <span className={cn(cells.badge, lesson.visibility === LessonVisibility.Involved && cells['badge--involved'])}>
          {lesson.visibility === LessonVisibility.Involved ? 'Participants' : 'Public'}
        </span>
        {lesson.delayedDate && <span className={cn(cells.badge, cells['badge--moved'])}>Moved</span>}
      </div>
    ),
  },
];

const LessonsTable = ({ view, params, page, onPageChange, }: ILessonsTableProps) => {
  const { data, isLoading, isFetching, } = useLessonsQuery(view, { ...params, page, pageSize: LESSONS_PAGE_SIZE, });
  // the lesson is kept after closing so the modal keeps its content during the exit animation
  const [details, setDetails] = useState<TDetailsState>({ isOpen: false, lesson: null, });

  return (
    <>
      <Table<ILesson>
        columns={COLUMNS}
        rowKey={(lesson) => lesson.id}
        data={data?.items ?? []}
        skeletonRows={5}
        isLoading={isLoading}
        emptyText={'No lessons match'}
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
      />
    </>
  );
}

export default LessonsTable;
