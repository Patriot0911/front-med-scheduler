'use client';

import { useTranslation } from 'react-i18next';
import { LuLanguages } from 'react-icons/lu';
import { cn } from '@/lib/cn';
import { LOCALE_NAMES } from '@/i18n/config';
import useLocale from '@/i18n/client/useLocale';
import type { ILanguageSwitchProps } from '@/interfaces/i18n/locale';

import styles from './styles.module.scss';

const LanguageSwitch = ({ className, }: ILanguageSwitchProps) => {
  const { t, } = useTranslation();
  const { nextLocale, setLocale, } = useLocale();

  return (
    <button
      type={'button'}
      lang={nextLocale}
      className={cn(styles.button, className)}
      onClick={() => setLocale(nextLocale)}
      aria-label={t('language.switchTo', { language: LOCALE_NAMES[nextLocale], })}
    >
      <LuLanguages className={styles.icon} />
      <span>{LOCALE_NAMES[nextLocale]}</span>
    </button>
  );
};

export default LanguageSwitch;
