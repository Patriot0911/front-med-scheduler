'use client';

import { useState } from 'react';
import { LuArrowLeft, LuFolderMinus, LuPencil, LuPlus, LuTrash2 } from 'react-icons/lu';
import dayjs from '@/lib/dayjs';
import { mutationToLoadingState } from '@/lib/loading-mappers';
import useLessonsQuery from '@/hooks/queries/lessons/useLessonsQuery';
import useRemoveLessonsFromGroupMutation from '@/hooks/mutations/lessons/useRemoveLessonsFromGroupMutation';
import useDeleteLessonsMutation from '@/hooks/mutations/lessons/useDeleteLessonsMutation';
import type { ILesson } from '@/interfaces/lessons/lesson';
import type { ILessonGroupLessonsProps } from '@/interfaces/lessons/lesson-group';
import type { ITableAction, ITableColumn } from '@/interfaces/ui/table';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import { createSelectColumn } from '@/components/ui/Table/selectColumn';
import ConfirmModal from '@/components/modals/ConfirmModal';
import LessonFormModal from '../../../LessonFormModal';
import AssignLessonsModal from '../../../AssignLessonsModal';
import { LESSON_COLUMNS } from '../../../LessonsTable';
import { pluralLessons } from '../../lesson-group-text';

import styles from './styles.module.scss';

type TLessonsAction = { kind: 'remove' | 'delete'; lessons: ILesson[] };

const describeAction = ({ kind, lessons, }: TLessonsAction) => {
  const isOne = lessons.length === 1;
  const what = isOne
    ? `“${lessons[0].name}” (${dayjs(lessons[0].date).format('DD.MM.YYYY HH:mm')})`
    : pluralLessons(lessons.length);
  return kind === 'delete'
    ? `Delete ${what}? ${isOne ? 'It is' : 'They are'} removed from the schedule for everyone. This can’t be undone.`
    : `Take ${what} out of the group? ${isOne ? 'It stays' : 'They stay'} in the schedule, without a group.`;
};

/** The lessons screen of the group modal: the list with row and bulk actions */
const LessonGroupLessons = ({ group, canManage, onBack, }: ILessonGroupLessonsProps) => {
  const { data, isLoading, } = useLessonsQuery('admin', { lessonGroupIds: [group.id], });
  const lessons = data?.items ?? [];
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const selectedLessons = lessons.filter((lesson) => selected.has(lesson.id));
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  // kept after closing so the modals keep their content during the exit animation
  const [edit, setEdit] = useState<{ isOpen: boolean; lesson: ILesson | null }>({ isOpen: false, lesson: null, });
  const [action, setAction] = useState<{ isOpen: boolean; value: TLessonsAction | null }>({ isOpen: false, value: null, });

  const closeAction = () => setAction((prev) => ({ ...prev, isOpen: false, }));
  const afterAction = () => {
    closeAction();
    setSelected(new Set());
  };
  const removeMutation = useRemoveLessonsFromGroupMutation(afterAction);
  const deleteMutation = useDeleteLessonsMutation(afterAction);
  const actionMutation = action.value?.kind === 'delete' ? deleteMutation : removeMutation;

  const openAction = (kind: TLessonsAction['kind'], targets: ILesson[]) => {
    removeMutation.reset();
    deleteMutation.reset();
    setAction({ isOpen: true, value: { kind, lessons: targets, }, });
  };
  const confirmAction = () => {
    if (!action.value) return;
    const lessonIds = action.value.lessons.map(({ id, }) => id);
    if (action.value.kind === 'delete') deleteMutation.mutate(lessonIds);
    else removeMutation.mutate({ lessonGroupId: group.id, lessonIds, });
  };
  const openEdit = (lesson: ILesson) => setEdit({ isOpen: true, lesson, });
  const toggleSelected = ({ id, }: ILesson) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const columns: ITableColumn<ILesson>[] = [
    ...(canManage
      ? [createSelectColumn({
        rows: lessons,
        getId: (lesson) => lesson.id,
        selected,
        onChange: setSelected,
        getLabel: (lesson) => `Select ${lesson.name}`,
      })]
      : []),
    LESSON_COLUMNS.date,
    { ...LESSON_COLUMNS.name, render: (lesson) => <span className={styles.name} title={lesson.name}>{lesson.name}</span>, },
    LESSON_COLUMNS.teachers,
  ];
  const actions: ITableAction<ILesson>[] | undefined = canManage
    ? [
      { key: 'edit', icon: <LuPencil />, label: 'Edit lesson', onClick: openEdit, },
      { key: 'remove', icon: <LuFolderMinus />, label: 'Take out of the group', onClick: (lesson) => openAction('remove', [lesson]), },
      { key: 'delete', icon: <LuTrash2 />, label: 'Delete lesson', variant: 'danger', onClick: (lesson) => openAction('delete', [lesson]), },
    ]
    : undefined;

  return (
    <>
      <Modal.Header
        title={'Lessons'}
        description={`“${group.name}” · ${isLoading ? '…' : pluralLessons(lessons.length)}`}
      />
      <Modal.Content className={styles.content}>
        {canManage && (
          <div className={styles.toolbar}>
            {selectedLessons.length > 0
              ? (
                <div className={styles.selection}>
                  <span className={styles['selection-count']}>{pluralLessons(selectedLessons.length)} selected</span>
                  <Button variant={'ghost'} onClick={() => setSelected(new Set())}>Clear</Button>
                  <Button variant={'secondary'} leftIcon={<LuFolderMinus />} onClick={() => openAction('remove', selectedLessons)}>
                    Take out
                  </Button>
                  <Button variant={'danger'} leftIcon={<LuTrash2 />} onClick={() => openAction('delete', selectedLessons)}>
                    Delete
                  </Button>
                </div>
              )
              : <span className={styles.hint}>Pick lessons to take them out of the group or delete them together.</span>}
            <Button variant={'secondary'} leftIcon={<LuPlus />} onClick={() => setIsAssignOpen(true)}>
              Add existing lessons
            </Button>
          </div>
        )}
        <Table<ILesson>
          columns={columns}
          actions={actions}
          rowKey={(lesson) => lesson.id}
          data={lessons}
          skeletonRows={4}
          isLoading={isLoading}
          emptyText={'No lessons in this group yet'}
          onRowClick={canManage ? toggleSelected : undefined}
          rowSize={'lg'}
        >
          <Table.Header />
          <Table.Body />
        </Table>
      </Modal.Content>
      <Modal.Footer>
        <Button className={'flex-1'} variant={'secondary'} leftIcon={<LuArrowLeft />} onClick={onBack}>
          Back
        </Button>
      </Modal.Footer>

      <AssignLessonsModal isOpen={isAssignOpen} onClose={() => setIsAssignOpen(false)} group={group} />
      <LessonFormModal
        isOpen={edit.isOpen}
        draft={null}
        lesson={edit.lesson}
        source={'admin'}
        onClose={() => setEdit((prev) => ({ ...prev, isOpen: false, }))}
      />
      <ConfirmModal
        isOpen={action.isOpen}
        onClose={closeAction}
        onConfirm={confirmAction}
        requestState={mutationToLoadingState(actionMutation)}
        description={action.value ? describeAction(action.value) : undefined}
      />
    </>
  );
}

export default LessonGroupLessons;
