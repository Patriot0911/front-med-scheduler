'use client';

import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import SidebarUserProfile from '../SidebarUserProfile';
import { useAppSelector } from '@/hooks/redux';
import { authStatusSelector } from '@/hooks/redux/auth';
import { useState } from 'react';
import AuthModal from '@/components/auth/AuthModal';
import Button from '@/components/ui/Button';
import { FaUserGraduate } from 'react-icons/fa';
import { ISidebarSectionProps } from '@/interfaces/layout/sidebar';

import styles from './styles.module.scss';

const UserSection = ({ isOpen }: ISidebarSectionProps) => {
  const [isShownAuthModal, setIsShownAuthModal] = useState(false);
  const status = useAppSelector(authStatusSelector);
  const { isLoading, isEnabled, } = useMeQuery();

  const canLogin = !isEnabled && status === 'guest';

  if (isLoading || status === 'init') return;

  return (
    <div className={styles['user-section-wrapper']}>
      <AuthModal
        isOpen={isShownAuthModal}
        onClose={() => setIsShownAuthModal(false)}
      />
      {
        canLogin ? (
          <Button
            onClick={() => setIsShownAuthModal(true)}
            leftIcon={FaUserGraduate({})}
          >
            {isOpen ? 'Sign In' : ''}
          </Button>
        ) : <SidebarUserProfile isOpen={isOpen} />
      }
    </div>
  );
}

export default UserSection;
