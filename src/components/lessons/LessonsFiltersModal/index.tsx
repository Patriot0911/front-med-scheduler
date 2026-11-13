'use client';

import type { ILessonsFiltersModalProps } from '@/interfaces/lessons/modal';
import SideModal from '@/components/ui/SideModal';
import LessonsFiltersForm from './components/LessonsFiltersForm';

const LessonsFiltersModal = ({ isOpen, onClose, ...formProps }: ILessonsFiltersModalProps) => {
  return (
    <SideModal isOpen={isOpen} onClose={onClose} size={'sm'}>
      <LessonsFiltersForm onClose={onClose} {...formProps} />
    </SideModal>
  );
}

export default LessonsFiltersModal;
