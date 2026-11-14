'use client';

import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

const Loading = () => {
  const { t, } = useTranslation('ui');
  return (
    <div className={styles.container} role={'status'} aria-label={t('loading')}>
      <div className={styles.loader} />
    </div>
  );
}

export default Loading;
