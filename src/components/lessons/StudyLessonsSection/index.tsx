'use client';

import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import Loading from '@/components/ui/Loading';
import QuerySyncedCalendar from '../QuerySyncedCalendar';

import styles from './styles.module.scss';

const StudyLessonsSection = () => {
  const { data: user, } = useMeQuery();

  if (!user) {
    return <Loading />;
  }

  if (!user.student) {
    return (
      <p className={styles.empty}>
        You don&apos;t have a student profile. Ask an administrator to add one.
      </p>
    );
  }

  if (!user.student.studentGroupId) {
    return (
      <p className={styles.empty}>
        You are not in a student group yet. Ask an administrator to add you to one.
      </p>
    );
  }

  return (
    <section className={styles.section}>
      <p className={styles.description}>
        Lessons of your student group.
      </p>
      <QuerySyncedCalendar />
    </section>
  );
}

export default StudyLessonsSection;
