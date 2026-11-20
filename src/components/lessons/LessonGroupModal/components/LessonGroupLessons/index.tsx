'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
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
import { createLessonColumns } from '../../../LessonsTable';

import styles from './styles.module.scss';

type TLessonsAction = { kind: 'remove' | 'delete'; lessons: ILesson[] };

const describeAction = ({ kind, lessons, }: TLessonsAction, t: TFunction<'lessons'>) => {
  if (lessons.length === 1) {
    const params = { name: lessons[0].name, date: dayjs(lessons[0].date).format('DD.MM.YYYY HH:mm'), };
    return kind === 'delete'
      ? t('groups.lessons.confirmDeleteOne', params)
      : t('groups.lessons.confirmTakeOutOne', params);
  }
  return kind === 'delete'
    ? t('groups.lessons.confirmDeleteMany', { count: lessons.length, })
    : t('groups.lessons.confirmTakeOutMany', { count: lessons.length, });
};

/** The lessons screen of the group modal: the list with row and bulk actions */
const LessonGroupLessons = ({ group, source, canManage, onBack, }: ILessonGroupLessonsProps) => {
  const { t, } = useTranslation('lessons');
  const lessonColumns = useMemo(() => createLessonColumns(t), [t]);
  const { data, isLoading, } = useLessonsQuery(source === 'admin' ? 'admin' : 'all', { lessonGroupIds: [group.id], });
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
        getLabel: (lesson) => t('groups.lessons.select', { name: lesson.name, }),
      })]
      : []),
    lessonColumns.date,
    { ...lessonColumns.name, render: (lesson) => <span className={styles.name} title={lesson.name}>{lesson.name}</span>, },
    lessonColumns.teachers,
  ];
  const actions: ITableAction<ILesson>[] | undefined = canManage
    ? [
      { key: 'edit', icon: <LuPencil />, label: t('groups.lessons.editLesson'), onClick: openEdit, },
      { key: 'remove', icon: <LuFolderMinus />, label: t('groups.lessons.takeOutOne'), onClick: (lesson) => openAction('remove', [lesson]), },
      { key: 'delete', icon: <LuTrash2 />, label: t('groups.lessons.deleteLesson'), variant: 'danger', onClick: (lesson) => openAction('delete', [lesson]), },
    ]
    : undefined;

  return (
    <>
      <Modal.Header
        title={t('groups.lessons.title')}
        description={t('groups.lessons.description', { name: group.name, count: isLoading ? '…' : t('count', { count: lessons.length, }), })}
      />
      <Modal.Content className={styles.content}>
        {canManage && (
          <div className={styles.toolbar}>
            {selectedLessons.length > 0
              ? (
                <div className={styles.selection}>
                  <span className={styles['selection-count']}>{t('groups.lessons.selected', { count: selectedLessons.length, })}</span>
                  <Button variant={'ghost'} onClick={() => setSelected(new Set())}>{t('clear')}</Button>
                  <Button variant={'secondary'} leftIcon={<LuFolderMinus />} onClick={() => openAction('remove', selectedLessons)}>
                    {t('groups.lessons.takeOut')}
                  </Button>
                  <Button variant={'danger'} leftIcon={<LuTrash2 />} onClick={() => openAction('delete', selectedLessons)}>
                    {t('groups.lessons.delete')}
                  </Button>
                </div>
              )
              : <span className={styles.hint}>{t('groups.lessons.hint')}</span>}
            <Button variant={'secondary'} leftIcon={<LuPlus />} onClick={() => setIsAssignOpen(true)}>
              {t('groups.lessons.addExisting')}
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
          emptyText={t('groups.lessons.empty')}
          onRowClick={canManage ? toggleSelected : undefined}
          rowSize={'lg'}
        >
          <Table.Header />
          <Table.Body />
        </Table>
      </Modal.Content>
      <Modal.Footer>
        <Button className={'flex-1'} variant={'secondary'} leftIcon={<LuArrowLeft />} onClick={onBack}>
          {t('back')}
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
        description={action.value ? describeAction(action.value, t) : undefined}
      />
    </>
  );
}

export default LessonGroupLessons;
