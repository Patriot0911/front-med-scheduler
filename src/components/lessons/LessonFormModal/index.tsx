'use client';

import type { ILessonFormModalProps } from '@/interfaces/lessons/modal';
import Modal from '@/components/ui/Modal';
import LessonForm from './components/LessonForm';

const LessonFormModal = ({ isOpen, draft, ...formProps }: ILessonFormModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={formProps.onClose} size={'lg'}>
      {draft && <LessonForm draft={draft} {...formProps} />}
    </Modal>
  );
}

export default LessonFormModal;
