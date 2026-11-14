'use client';

import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';

import styles from './styles.module.scss';

const ScheduleHero = () => {
  const { t, } = useTranslation('public');

  return (
    <header className={styles.hero}>
      <Link href="/" aria-label={t('goToPlatform')} className={styles['logo-link']}>
        <span className={styles.halo} aria-hidden />
        <Image
          alt={t('logoAlt')}
          src="/med-logo.png"
          width={112}
          height={112}
          className={styles.logo}
          priority
        />
      </Link>
      <span className={styles.wordmark}>{t('wordmark')}</span>
      <p className={styles.subtitle}>
        {t('subtitle')}
      </p>
    </header>
  );
};

export default ScheduleHero;
