'use client';

import { useTranslation } from 'react-i18next';
import LessonsBrowser from '../LessonsBrowser';

import styles from './styles.module.scss';

const AllLessonsSection = () => {
  const { t, } = useTranslation('lessons');

  return (
    <section className={styles.section}>
      <p className={styles.description}>
        {t('sections.all.description')}
      </p>
      <LessonsBrowser view={'all'} />
    </section>
  );
}

export default AllLessonsSection;
