'use client';

import { useState } from 'react';
import { LuPlus, LuSearch, LuX } from 'react-icons/lu';
import useDebouncedValue from '@/hooks/shared/useDebouncedValue';
import useLessonsQuery from '@/hooks/queries/lessons/useLessonsQuery';
import useAssignLessonsToGroupMutation from '@/hooks/mutations/lessons/useAssignLessonsToGroupMutation';
import type { ILesson } from '@/interfaces/lessons/lesson';
import type { IAssignLessonsModalProps, ILessonGroup } from '@/interfaces/lessons/lesson-group';
import type { ITableColumn } from '@/interfaces/ui/table';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Switch from '@/components/ui/Switch';
import Table from '@/components/ui/Table';
import { createSelectColumn } from '@/components/ui/Table/selectColumn';
import { LESSON_COLUMNS } from '../LessonsTable';

import cells from '../cells/styles.module.scss';
import styles from './styles.module.scss';

const PAGE_SIZE = 6;

const plural = (count: number) => `${count} ${count === 1 ? 'lesson' : 'lessons'}`;

const AssignLessonsContent = ({ group, onClose, }: { group: ILessonGroup; onClose: () => void }) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim());
  const [isOnlyUngrouped, setIsOnlyUngrouped] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const paramsKey = `${debouncedSearch}|${isOnlyUngrouped}`;
  const [pageState, setPageState] = useState({ key: paramsKey, page: 1, });
  const page = pageState.key === paramsKey ? pageState.page : 1;

  const { data, isLoading, isFetching, } = useLessonsQuery('admin', {
    ...(debouncedSearch ? { search: debouncedSearch, } : {}),
    ...(isOnlyUngrouped ? { withoutLessonGroup: true, } : {}),
    page,
    pageSize: PAGE_SIZE,
  });
  const mutation = useAssignLessonsToGroupMutation(onClose);
  const lessons = data?.items ?? [];
  const isInGroup = (lesson: ILesson) => lesson.lessonGroupId === group.id;

  const columns: ITableColumn<ILesson>[] = [
    createSelectColumn({
      rows: lessons,
      getId: (lesson) => lesson.id,
      selected,
      onChange: setSelected,
      isSelectable: (lesson) => !isInGroup(lesson),
      getLabel: (lesson) => `Select ${lesson.name}`,
    }),
    LESSON_COLUMNS.date,
    {
      key: 'name',
      title: 'Lesson',
      render: (lesson) => (
        <div className={cells.stack}>
          <span className={cells.primary} title={lesson.name}>{lesson.name}</span>
          <span className={cells.secondary}>
            {isInGroup(lesson)
              ? 'Already in this group'
              : lesson.lessonGroupName ? `Moves from “${lesson.lessonGroupName}”` : 'No group'}
          </span>
        </div>
      ),
    },
    LESSON_COLUMNS.teachers,
  ];

  return (
    <>
      <Modal.Header
        title={'Add lessons to the group'}
        description={`Existing lessons go into “${group.name}”. A lesson of another group moves here.`}
      />
      <Modal.Content className={styles.content}>
        <div className={`${styles.toolbar} fields-compact`}>
          <div className={styles.search}>
            <Input
              name={'assign-lessons-search'}
              value={search}
              placeholder={'Search lessons…'}
              aria-label={'Search lessons'}
              onChange={(e) => setSearch(e.target.value)}
              icon={search ? <LuX /> : <LuSearch />}
              onIconClick={() => setSearch('')}
              hideErrorMessage
            />
          </div>
          <Switch checked={isOnlyUngrouped} onChange={setIsOnlyUngrouped} label={'Only lessons without a group'} />
        </div>
        <Table<ILesson>
          columns={columns}
          rowKey={(lesson) => lesson.id}
          data={lessons}
          skeletonRows={PAGE_SIZE}
          isLoading={isLoading}
          emptyText={'No lessons match'}
          onRowClick={(lesson) => {
            if (isInGroup(lesson)) return;
            const next = new Set(selected);
            if (next.has(lesson.id)) next.delete(lesson.id);
            else next.add(lesson.id);
            setSelected(next);
          }}
          pageSize={PAGE_SIZE}
          rowSize={'lg'}
          pagination={{
            page,
            total: data?.meta.count ?? 0,
            onChange: (next) => setPageState({ key: paramsKey, page: next, }),
            disabled: isFetching,
          }}
        >
          <Table.Header />
          <Table.Body />
        </Table>
        {selected.size > 0 && (
          <div className={styles.selection}>
            <span>{plural(selected.size)} selected</span>
            <Button variant={'ghost'} onClick={() => setSelected(new Set())}>Clear</Button>
          </div>
        )}
      </Modal.Content>
      <Modal.Footer>
        <Button className={'flex-1'} variant={'secondary'} onClick={onClose} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button
          className={'flex-1'}
          leftIcon={<LuPlus />}
          disabled={selected.size === 0}
          isLoading={mutation.isPending}
          onClick={() => mutation.mutate({ lessonGroupId: group.id, lessonIds: [...selected], })}
        >
          {selected.size ? `Add ${plural(selected.size)}` : 'Add lessons'}
        </Button>
      </Modal.Footer>
    </>
  );
}

/** Existing lessons into a group: picked across pages and searches, sent together */
const AssignLessonsModal = ({ isOpen, onClose, group, }: IAssignLessonsModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'lg'}>
      {group && <AssignLessonsContent group={group} onClose={onClose} />}
    </Modal>
  );
}

export default AssignLessonsModal;
