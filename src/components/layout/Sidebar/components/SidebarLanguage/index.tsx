'use client';

import { useTranslation } from 'react-i18next';
import { LuLanguages } from 'react-icons/lu';
import { cn } from '@/lib/cn';
import { LOCALE_NAMES } from '@/i18n/config';
import useLocale from '@/i18n/client/useLocale';
import { ISidebarSectionProps } from '@/interfaces/layout/sidebar';

import styles from '../SidebarToggle/styles.module.scss';

const SidebarLanguage = ({ isOpen, }: ISidebarSectionProps) => {
  const { t, } = useTranslation();
  const { nextLocale, setLocale, } = useLocale();
  const label = t('language.switchTo', { language: LOCALE_NAMES[nextLocale], });

  return (
    <div className={styles['toggle-wrapper']}>
      <button
        type={'button'}
        lang={nextLocale}
        className={cn(styles['toggle-button'], !isOpen && styles.collapsed)}
        onClick={() => setLocale(nextLocale)}
        aria-label={label}
        title={label}
      >
        <LuLanguages />
        <span>{LOCALE_NAMES[nextLocale]}</span>
      </button>
    </div>
  );
}

export default SidebarLanguage;
