'use client';

import { useCallback, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { LuLogOut } from 'react-icons/lu';
import { IProfileModalProps, TProfileTab } from '@/interfaces/auth/profile';
import { ITabItem } from '@/interfaces/ui/tabs';
import { LoadingState } from '@/lib/loading-mappers';
import useLogoutMutation from '@/hooks/mutations/auth/useLogoutMutation';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import ConfirmModal from '@/components/modals/ConfirmModal';
import ProfileSummary from './ProfileSummary';
import PersonalDataTab from './PersonalDataTab';
import PasswordTab from './PasswordTab';

import styles from './styles.module.scss';

const TABS: ITabItem<TProfileTab>[] = [
  { key: 'profile', data: 'profile', label: 'Profile', },
  { key: 'password', data: 'password', label: 'Password', },
];

// the panel leaves instantly and the next one slides in from its side (`custom`: -1 left, 1 right)
const PANEL_VARIANTS: Variants = {
  hidden: (side: number) => ({
    opacity: 0,
    x: side * 24,
    transition: { duration: 0, },
    transitionEnd: { display: 'none', },
  }),
  shown: {
    display: 'block',
    opacity: 1,
    x: 0,
    transition: { duration: 0.22, ease: 'easeOut', },
  },
};

/**
 * Both tabs stay mounted (inactive one is hidden), so switching tabs keeps unsaved input;
 * closing with unsaved input in any tab asks to discard it.
 * Remount it per opening (key), so every opening starts clean.
 */
const ProfileModal = ({ isOpen, onClose, }: IProfileModalProps) => {
  const [tab, setTab] = useState<TProfileTab>('profile');
  const [dirtyTabs, setDirtyTabs] = useState<Record<TProfileTab, boolean>>({ profile: false, password: false, });
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const logoutMutation = useLogoutMutation();
  const hasUnsavedChanges = dirtyTabs.profile || dirtyTabs.password;

  const onProfileDirtyChange = useCallback((isDirty: boolean) => (
    setDirtyTabs((prev) => ({ ...prev, profile: isDirty, }))
  ), []);
  const onPasswordDirtyChange = useCallback((isDirty: boolean) => (
    setDirtyTabs((prev) => ({ ...prev, password: isDirty, }))
  ), []);

  const requestClose = () => {
    if (hasUnsavedChanges) {
      setIsDiscardConfirmOpen(true);
      return;
    }
    onClose();
  };

  const logoutButton = (
    <Button
      variant={'ghost'}
      leftIcon={<LuLogOut />}
      className={styles.logout}
      aria-label={'Log out'}
      disabled={logoutMutation.isPending}
      onClick={() => logoutMutation.mutate(undefined, { onSuccess: onClose, })}
    >
      <span className={styles['logout-label']}>Log out</span>
    </Button>
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={requestClose} size={'md'} isLoading={logoutMutation.isPending}>
        <Modal.Header title={'Profile'} />
        <ProfileSummary />
        <Tabs<TProfileTab>
          variant={'underline'}
          className={styles.tabs}
          items={TABS}
          value={tab}
          onChange={setTab}
          renderItem={(item) => (
            <>
              {item.label}
              {dirtyTabs[item.data] && <span className={styles['dirty-dot']} aria-label={'Unsaved changes'} />}
            </>
          )}
        />
        <motion.div
          custom={-1}
          variants={PANEL_VARIANTS}
          initial={false}
          animate={tab === 'profile' ? 'shown' : 'hidden'}
        >
          <PersonalDataTab
            onDirtyChange={onProfileDirtyChange}
            onCancel={requestClose}
            footerStart={logoutButton}
          />
        </motion.div>
        <motion.div
          custom={1}
          variants={PANEL_VARIANTS}
          initial={false}
          animate={tab === 'password' ? 'shown' : 'hidden'}
        >
          <PasswordTab
            onDirtyChange={onPasswordDirtyChange}
            onCancel={requestClose}
            footerStart={logoutButton}
          />
        </motion.div>
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
