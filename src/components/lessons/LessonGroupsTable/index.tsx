'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { LuEye, LuPencil, LuTrash2 } from 'react-icons/lu';
import dayjs from '@/lib/dayjs';
import Table from '@/components/ui/Table';
import useAdminLessonGroupsQuery from '@/hooks/queries/lessons/useAdminLessonGroupsQuery';
import type { ILessonGroup, ILessonGroupsTableProps } from '@/interfaces/lessons/lesson-group';
import type { ITableAction, ITableColumn } from '@/interfaces/ui/table';

import cells from '../cells/styles.module.scss';

export const LESSON_GROUPS_PAGE_SIZE = 10;
const DATE_FORMAT = 'DD.MM.YYYY';

const emptyCell = <span className={cells.empty}>—</span>;

const createColumns = (t: TFunction<'lessons'>): ITableColumn<ILessonGroup>[] => [
  {
    key: 'name',
    title: t('groups.columns.name'),
    render: (group) => (
      <div className={cells.stack}>
        <span className={cells.primary} title={group.name}>{group.name}</span>
        {group.note && <span className={cells.secondary} title={group.note}>{group.note}</span>}
      </div>
    ),
  },
  {
    key: 'department',
    title: t('groups.columns.department'),
    width: '12rem',
    render: (group) => group.departmentName
      ? <span className={cells.secondary} title={group.departmentName}>{group.departmentName}</span>
      : emptyCell,
  },
  {
    key: 'createdBy',
    title: t('groups.columns.createdBy'),
    width: '12rem',
    render: (group) => group.createdByTeacherName
      ? <span className={cells.secondary} title={group.createdByTeacherName}>{group.createdByTeacherName}</span>
      : emptyCell,
  },
  {
    key: 'lessons',
    title: t('groups.columns.lessons'),
    width: '6rem',
    align: 'right',
    render: (group) => group.lessonsCount,
  },
  {
    key: 'period',
    title: t('groups.columns.period'),
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

const LessonGroupsTable = ({ search, page, onPageChange, onOpen, onDelete, }: ILessonGroupsTableProps) => {
  const { t, } = useTranslation('lessons');
  const columns = useMemo(() => createColumns(t), [t]);
  const { data, isLoading, isFetching, } = useAdminLessonGroupsQuery(page, LESSON_GROUPS_PAGE_SIZE, search);
  const actions: ITableAction<ILessonGroup>[] = [
    { key: 'open', icon: onDelete ? <LuPencil /> : <LuEye />, label: onDelete ? t('groups.edit') : t('groups.view'), onClick: onOpen, },
    ...(onDelete
      ? [{ key: 'delete', icon: <LuTrash2 />, label: t('groups.delete'), variant: 'danger' as const, onClick: onDelete, }]
      : []),
  ];

  return (
    <Table<ILessonGroup>
      columns={columns}
      actions={actions}
      onRowClick={onOpen}
      rowKey={(group) => group.id}
      data={data?.items ?? []}
      skeletonRows={5}
      isLoading={isLoading}
      emptyText={search ? t('groups.emptySearch') : t('groups.empty')}
      pageSize={LESSON_GROUPS_PAGE_SIZE}
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
