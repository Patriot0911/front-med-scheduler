'use client';

import { FaUserGraduate } from 'react-icons/fa6';
import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import { ISidebarSectionProps } from '@/interfaces/layout/sidebar';

import styles from './styles.module.scss';
import useLogoutMutation from '@/hooks/mutations/auth/useLogoutMutation';
import Button from '@/components/ui/Button';

const SidebarUserProfile = ({ isOpen }: ISidebarSectionProps) => {
  const { data, } = useMeQuery();
  const logoutMutation = useLogoutMutation();

  const logoutHandle = () => {
    logoutMutation.mutate();
  };

  if (!data) return null;

  return (
    <div className={styles['user-profile-wrapper']}>
      <div className={styles['avatar-wrapper']}>
        <FaUserGraduate />
      </div>
      {
        isOpen && (
          <div className={styles['user-info']}>
            <span className={styles['user-name']}>{data.fullName}</span>
            <span className={styles['user-role']}>{data.roles[0]}</span>
          </div>
        )
      }
      {/* <div className={styles['logout-wrapper']}>
        <Button variant={'danger'} onClick={logoutHandle} disabled={logoutMutation.isPending}>Log out</Button>
      </div> */}
    </div>
  );
}

export default SidebarUserProfile;
