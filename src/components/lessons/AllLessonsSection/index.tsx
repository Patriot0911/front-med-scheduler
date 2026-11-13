'use client';

import LessonsBrowser from '../LessonsBrowser';

import styles from './styles.module.scss';

const AllLessonsSection = () => {
  return (
    <section className={styles.section}>
      <p className={styles.description}>
        Every lesson available to you: public ones and the ones you take part in.
      </p>
      <LessonsBrowser view={'all'} />
    </section>
  );
}

export default AllLessonsSection;
