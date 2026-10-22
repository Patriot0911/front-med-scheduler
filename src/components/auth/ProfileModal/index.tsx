'use client';

import { useCallback, useState } from 'react';
import { LuLogOut } from 'react-icons/lu';
import { IProfileModalProps } from '@/interfaces/auth/profile';
import { LoadingState } from '@/lib/loading-mappers';
import useLogoutMutation from '@/hooks/mutations/auth/useLogoutMutation';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/modals/ConfirmModal';
import ProfileSummary from './ProfileSummary';
import PersonalDataSection from './PersonalDataSection';
import PasswordSection from './PasswordSection';

import styles from './styles.module.scss';

type TSectionKey = 'data' | 'password';

/**
 * Profile of the signed-in user: a read-only summary, then sections edited one by one.
 * Remount it per opening (key), so every opening starts in the view mode.
 */
const ProfileModal = ({ isOpen, onClose, }: IProfileModalProps) => {
  const [dirtySections, setDirtySections] = useState<Record<TSectionKey, boolean>>({ data: false, password: false, });
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const logoutMutation = useLogoutMutation();
  const hasUnsavedChanges = dirtySections.data || dirtySections.password;

  // stable, so the sections' effects do not rerun on every render
  const onDataDirtyChange = useCallback((isDirty: boolean) => (
    setDirtySections((prev) => ({ ...prev, data: isDirty, }))
  ), []);
  const onPasswordDirtyChange = useCallback((isDirty: boolean) => (
    setDirtySections((prev) => ({ ...prev, password: isDirty, }))
  ), []);

  // Close button, overlay and Escape all come here
  const requestClose = () => {
    if (hasUnsavedChanges) {
      setIsDiscardConfirmOpen(true);
      return;
    }
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={requestClose} size={'md'} isLoading={logoutMutation.isPending}>
        <Modal.Header title={'Profile'} />
        <ProfileSummary />
        <div className={styles.sections}>
          <PersonalDataSection onDirtyChange={onDataDirtyChange} />
          <PasswordSection onDirtyChange={onPasswordDirtyChange} />
        </div>
        <Modal.Footer>
          <Button
            variant={'ghost'}
            leftIcon={<LuLogOut />}
            className={styles.logout}
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate(undefined, { onSuccess: onClose, })}
          >
            Log out
          </Button>
          <Button variant={'secondary'} onClick={requestClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmModal
        isOpen={isDiscardConfirmOpen}
        onClose={() => setIsDiscardConfirmOpen(false)}
        onConfirm={() => {
          setIsDiscardConfirmOpen(false);
          onClose();
        }}
        requestState={LoadingState.Ide}
        description={'You have unsaved changes in your profile. Close it and discard them?'}
      />
    </>
  );
}

export default ProfileModal;
