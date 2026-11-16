'use client';

import { useTranslation } from 'react-i18next';
import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import Loading from '@/components/ui/Loading';
import LessonsBrowser from '../LessonsBrowser';

import styles from './styles.module.scss';

const StudyLessonsSection = () => {
  const { t, } = useTranslation('lessons');
  const { data: user, } = useMeQuery();

  if (!user) {
    return <Loading />;
  }

  if (!user.student) {
    return (
      <p className={styles.empty}>
        {t('sections.study.noProfile')}
      </p>
    );
  }

  if (!user.student.studentGroupId) {
    return (
      <p className={styles.empty}>
        {t('sections.study.noGroup')}
      </p>
    );
  }

  return (
    <section className={styles.section}>
      <p className={styles.description}>
        {t('sections.study.description')}
      </p>
      <LessonsBrowser view={'study'} />
    </section>
  );
}

export default StudyLessonsSection;
