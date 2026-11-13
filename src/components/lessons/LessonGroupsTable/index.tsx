'use client';

import dayjs from '@/lib/dayjs';
import Table from '@/components/ui/Table';
import useAdminLessonGroupsQuery from '@/hooks/queries/lessons/useAdminLessonGroupsQuery';
import type { ILessonGroup, ILessonGroupsTableProps } from '@/interfaces/lessons/lesson-group';
import type { ITableColumn } from '@/interfaces/ui/table';

import cells from '../cells/styles.module.scss';

const PAGE_SIZE = 10;
const DATE_FORMAT = 'DD.MM.YYYY';

const emptyCell = <span className={cells.empty}>—</span>;

const COLUMNS: ITableColumn<ILessonGroup>[] = [
  {
    key: 'name',
    title: 'Lesson group',
    render: (group) => (
      <div className={cells.stack}>
        <span className={cells.primary} title={group.name}>{group.name}</span>
        {group.note && <span className={cells.secondary} title={group.note}>{group.note}</span>}
      </div>
    ),
  },
  {
    key: 'department',
    title: 'Department',
    width: '12rem',
    render: (group) => group.departmentName
      ? <span className={cells.secondary} title={group.departmentName}>{group.departmentName}</span>
      : emptyCell,
  },
  {
    key: 'createdBy',
    title: 'Created by',
    width: '12rem',
    render: (group) => group.createdByTeacherName
      ? <span className={cells.secondary} title={group.createdByTeacherName}>{group.createdByTeacherName}</span>
      : emptyCell,
  },
  {
    key: 'lessons',
    title: 'Lessons',
    width: '6rem',
    align: 'right',
    render: (group) => group.lessonsCount,
  },
  {
    key: 'period',
    title: 'Period',
    width: '12rem',
    render: (group) => group.firstLessonDate && group.lastLessonDate
      ? (
        <span className={cells.secondary}>
          {dayjs(group.firstLessonDate).format(DATE_FORMAT)} – {dayjs(group.lastLessonDate).format(DATE_FORMAT)}
        </span>
      )
      : emptyCell,
  },
];

const LessonGroupsTable = ({ search, page, onPageChange, }: ILessonGroupsTableProps) => {
  const { data, isLoading, isFetching, } = useAdminLessonGroupsQuery(page, PAGE_SIZE, search);

  return (
    <Table<ILessonGroup>
      columns={COLUMNS}
      rowKey={(group) => group.id}
      data={data?.items ?? []}
      skeletonRows={5}
      isLoading={isLoading}
      emptyText={search ? 'No lesson groups match the search' : 'No lesson groups yet'}
      pageSize={PAGE_SIZE}
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
  );
}

export default LessonGroupsTable;
