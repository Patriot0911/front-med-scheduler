'use client';

import { LuPanelLeftClose, LuPanelLeftOpen } from 'react-icons/lu';
import { cn } from '@/lib/cn';
import { ISidebarToggleProps } from '@/interfaces/layout/sidebar';

import styles from './styles.module.scss';

const SidebarToggle = ({ isOpen, changeOpen }: ISidebarToggleProps) => {
  return (
    <div className={styles['toggle-wrapper']}>
      <button
        type={'button'}
        className={cn(styles['toggle-button'], !isOpen && styles.collapsed)}
        onClick={changeOpen}
        aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        aria-expanded={isOpen}
        title={isOpen ? undefined : 'Expand sidebar'}
      >
        {isOpen ? <LuPanelLeftClose /> : <LuPanelLeftOpen />}
        <span>Collapse</span>
      </button>
    </div>
  );
}

export default SidebarToggle;
