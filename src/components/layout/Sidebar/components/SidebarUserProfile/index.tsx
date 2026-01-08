'use client';

import { useAppSelector } from '@/hooks/redux';
import { useUserSelector } from '@/hooks/redux/auth';
import { FaUserGraduate } from 'react-icons/fa6';

import styles from './styles.module.scss';

const SidebarUserProfile = () => {
  const user = useAppSelector(useUserSelector);
  return (
    <div className={styles['user-profile-wrapper']}>
      <div className={styles['avatar-wrapper']}>
        <FaUserGraduate />
      </div>
      <div className={styles['user-info']}>
        <span className={styles['user-name']}>{user?.fullName}</span>
        <span className={styles['user-role']}>{user?.roles[0]}</span>
      </div>
    </div>
  );
}

export default SidebarUserProfile;
