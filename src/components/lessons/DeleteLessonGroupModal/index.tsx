'use client';

import { useState } from 'react';
import { mutationToLoadingState } from '@/lib/loading-mappers';
import useDeleteLessonGroupMutation from '@/hooks/mutations/lessons/useDeleteLessonGroupMutation';
import type { IDeleteLessonGroupModalProps } from '@/interfaces/lessons/lesson-group';
import ConfirmModal from '@/components/modals/ConfirmModal';
import Switch from '@/components/ui/Switch';

const plural = (count: number) => `${count} ${count === 1 ? 'lesson' : 'lessons'}`;

/**
 * The lessons stay without a group, unless they are deleted too.
 * Remount it (a new `key`) for every opening: the choice and the request start fresh.
 */
const DeleteLessonGroupModal = ({ isOpen, onClose, group, onDeleted, }: IDeleteLessonGroupModalProps) => {
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
        ? `Delete the lesson group “${group.name}”? ${lessonsCount === 0
          ? 'It has no lessons.'
          : withLessons
            ? `Its ${plural(lessonsCount)} will be deleted too. This can’t be undone.`
            : `Its ${plural(lessonsCount)} stay in the schedule, without a group.`}`
        : undefined}
    >
      {lessonsCount > 0 && (
        <Switch
          checked={withLessons}
          onChange={setWithLessons}
          label={`Also delete its ${plural(lessonsCount)}`}
          hint={'Otherwise they only leave the group'}
        />
      )}
    </ConfirmModal>
  );
}

export default DeleteLessonGroupModal;
