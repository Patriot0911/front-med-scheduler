import { ISidebarHeaderProps } from '@/interfaces/layout/sidebar';

import styles from './styles.module.scss';

const SidebarHeader = ({ }: ISidebarHeaderProps) => {
  return (
    <div className={styles['top-wrapper']}>
      <span className={styles['logo-wrapper']}>Med Scheduler</span>
    </div>
  );
}

export default SidebarHeader;
