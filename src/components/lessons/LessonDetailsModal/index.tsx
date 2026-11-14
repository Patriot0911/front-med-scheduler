'use client';

import { LuPencil } from 'react-icons/lu';
import type { ILessonDetailsModalProps } from '@/interfaces/lessons/modal';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import LessonDetails from '../LessonDetails';

const LessonDetailsModal = ({ lesson, onEdit, ...props }: ILessonDetailsModalProps) => {
  return (
    <Modal {...props} size={'md'}>
      {lesson && (
        <>
          <Modal.Header title={lesson.name} description={lesson.lessonGroupName ?? undefined} />
          <Modal.Content>
            <LessonDetails lesson={lesson} />
          </Modal.Content>
          <Modal.Footer>
            <Button className={'flex-1'} variant={'secondary'} onClick={props.onClose}>
              Close
            </Button>
            {onEdit && lesson.canEdit && (
              <Button className={'flex-1'} variant={'primary'} leftIcon={<LuPencil />} onClick={() => onEdit(lesson)}>
                Edit
              </Button>
            )}
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default LessonDetailsModal;
