'use client';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { mutationToLoadingState } from '@/lib/loading-mappers';
import useDeleteLessonGroupMutation from '@/hooks/mutations/lessons/useDeleteLessonGroupMutation';
import type { IDeleteLessonGroupModalProps } from '@/interfaces/lessons/lesson-group';
import ConfirmModal from '@/components/modals/ConfirmModal';
import Switch from '@/components/ui/Switch';

/**
 * The lessons stay without a group, unless they are deleted too.
 * Remount it (a new `key`) for every opening: the choice and the request start fresh.
 */
const DeleteLessonGroupModal = ({ isOpen, onClose, group, onDeleted, }: IDeleteLessonGroupModalProps) => {
  const { t, } = useTranslation('lessons');
  const [withLessons, setWithLessons] = useState(false);
  const mutation = useDeleteLessonGroupMutation(() => {
    onClose();
    onDeleted?.();
  });
  const lessonsCount = group?.lessonsCount ?? 0;

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => group && mutation.mutate({ lessonGroupId: group.id, withLessons, })}
      requestState={mutationToLoadingState(mutation)}
      description={group
        ? `${t('groups.deleteModal.confirm', { name: group.name, })} ${lessonsCount === 0
          ? t('groups.deleteModal.noLessons')
          : withLessons
            ? t('groups.deleteModal.withLessons', { count: lessonsCount, })
            : t('groups.deleteModal.keepLessons', { count: lessonsCount, })}`
        : undefined}
    >
      {lessonsCount > 0 && (
        <Switch
          checked={withLessons}
          onChange={setWithLessons}
          label={t('groups.deleteModal.alsoDelete', { count: lessonsCount, })}
          hint={t('groups.deleteModal.alsoDeleteHint')}
        />
      )}
    </ConfirmModal>
  );
}

export default DeleteLessonGroupModal;
