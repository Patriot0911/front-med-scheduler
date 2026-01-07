'use client';

import SidebarUserProfile from '../SidebarUserProfile';
import LoginButton from '../LoginButton';

import styles from './styles.module.scss';
import { useAppSelector } from '@/hooks/redux';
import { useUserSelector } from '@/hooks/redux/auth';

const UserSection = () => {
  const user = useAppSelector(useUserSelector);

  if (!user)
    return <LoginButton />

  return (
    <div className={styles['user-section-wrapper']}>
      <SidebarUserProfile />
    </div>
  );
}

export default UserSection;
