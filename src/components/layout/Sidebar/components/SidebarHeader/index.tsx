import { ISidebarHeaderProps } from '@/interfaces/layout/sidebar';
import { MdOutlineKeyboardDoubleArrowLeft } from 'react-icons/md';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

const SidebarHeader = ({ isOpen, changeOpen}: ISidebarHeaderProps) => {
  return (
    <div className={styles['top-wrapper']}>
      <span className={styles['logo-wrapper']}>Med Scheduler</span>
      <button
        className={cn(styles['nav-button'], isOpen && styles['open'])}
        onClick={changeOpen}
      >
        <MdOutlineKeyboardDoubleArrowLeft />
      </button>
    </div>
  );
}

export default SidebarHeader;
