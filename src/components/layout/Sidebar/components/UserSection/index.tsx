import { SIDEBAR_SETTINGS } from '@/configs/sidebar.config';
import SidebarUserProfile from '../SidebarUserProfile';
import LoginButton from '../LoginButton';
import NavLink from '../NavLink';

import styles from './styles.module.scss';

const UserSection = () => {
  const isAuth = false;

  if (!isAuth)
    return <LoginButton />

  return (
    <div className={styles['user-section-wrapper']}>
      <NavLink {...SIDEBAR_SETTINGS} />
      <SidebarUserProfile />
    </div>
  );
}

export default UserSection;
