'use client';

import { useTranslation } from 'react-i18next';
import { LuPanelLeftClose, LuPanelLeftOpen } from 'react-icons/lu';
import { cn } from '@/lib/cn';
import { ISidebarToggleProps } from '@/interfaces/layout/sidebar';

import styles from './styles.module.scss';

const SidebarToggle = ({ isOpen, changeOpen }: ISidebarToggleProps) => {
  const { t, } = useTranslation('layout');

  return (
    <div className={styles['toggle-wrapper']}>
      <button
        type={'button'}
        className={cn(styles['toggle-button'], !isOpen && styles.collapsed)}
        onClick={changeOpen}
        aria-label={isOpen ? t('sidebar.collapseSidebar') : t('sidebar.expandSidebar')}
        aria-expanded={isOpen}
        title={isOpen ? undefined : t('sidebar.expandSidebar')}
      >
        {isOpen ? <LuPanelLeftClose /> : <LuPanelLeftOpen />}
        <span>{t('sidebar.collapse')}</span>
      </button>
    </div>
  );
}

export default SidebarToggle;
