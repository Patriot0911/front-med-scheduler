'use client';

import { FaUserGraduate } from 'react-icons/fa6';
import useMeQuery from '@/hooks/queries/auth/useMeQuery';

import styles from './styles.module.scss';

const SidebarUserProfile = () => {
  const { data,} = useMeQuery();

  if (!data) return null;

  return (
    <div className={styles['user-profile-wrapper']}>
      <div className={styles['avatar-wrapper']}>
        <FaUserGraduate />
      </div>
      <div className={styles['user-info']}>
        <span className={styles['user-name']}>{data.fullName}</span>
        <span className={styles['user-role']}>{data.roles[0]}</span>
      </div>
    </div>
  );
}

export default SidebarUserProfile;
