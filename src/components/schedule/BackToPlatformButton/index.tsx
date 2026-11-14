'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { LuLayoutDashboard } from 'react-icons/lu';

import styles from './styles.module.scss';

const BackToPlatformButton = () => {
  const { t, } = useTranslation('public');

  return (
    <Link href="/" className={styles.button}>
      <LuLayoutDashboard className={styles.icon} />
      <span className={styles.label}>{t('backToPlatform')}</span>
    </Link>
  );
};

export default BackToPlatformButton;
