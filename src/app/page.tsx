'use client';
import BaseLayout from '@/components/layout/BaseLayout';
import ConfirmModal from '@/components/modals/ConfirmModal';
import { LoadingState } from '@/lib/loading-mappers';
import { useState } from 'react';

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <BaseLayout>
      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        confirmationWord='qwe'
        requestState={LoadingState.Ide}
        onConfirm={() => {}}
      />
    </BaseLayout>
  );
}

export default HomePage;
