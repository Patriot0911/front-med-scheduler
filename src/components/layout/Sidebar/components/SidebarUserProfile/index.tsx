'use client';

import { useState } from 'react';
import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import { ISidebarSectionProps } from '@/interfaces/layout/sidebar';
import ProfileModal from '@/components/auth/ProfileModal';
import Avatar from '@/components/ui/Avatar';

import styles from './styles.module.scss';

/** Signed-in user card; opens the profile modal to edit personal data and password. */
const SidebarUserProfile = ({ isOpen }: ISidebarSectionProps) => {
  const { data, } = useMeQuery();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // a new key per opening remounts the modal, so it starts with fresh forms
  const [profileKey, setProfileKey] = useState(0);

  const openProfile = () => {
    setProfileKey((prev) => prev + 1);
    setIsProfileOpen(true);
  };

  if (!data) return null;

  return (
    <>
      <button
        type={'button'}
        className={styles['user-profile-wrapper']}
        onClick={openProfile}
        aria-label={`Profile of ${data.fullName}`}
        // the collapsed sidebar shows only the avatar
        title={isOpen ? undefined : data.fullName}
      >
        <Avatar name={data.fullName} />
        {
          isOpen && (
            <div className={styles['user-info']}>
              <span className={styles['user-name']}>{data.fullName}</span>
              <span className={styles['user-role']}>{data.roles[0]}</span>
            </div>
          )
        }
      </button>
      <ProfileModal
        key={profileKey}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}

export default SidebarUserProfile;
