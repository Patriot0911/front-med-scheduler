'use client';

import type { ILessonFormModalProps } from '@/interfaces/lessons/modal';
import Modal from '@/components/ui/Modal';
import LessonForm from './components/LessonForm';

const LessonFormModal = ({ isOpen, ...formProps }: ILessonFormModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={formProps.onClose} size={'lg'}>
      {(formProps.draft || formProps.lesson) && <LessonForm {...formProps} />}
    </Modal>
  );
}

export default LessonFormModal;
