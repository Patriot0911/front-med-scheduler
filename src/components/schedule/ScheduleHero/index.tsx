import Image from 'next/image';
import Link from 'next/link';

import styles from './styles.module.scss';

const ScheduleHero = () => {
  return (
    <header className={styles.hero}>
      <Link href="/" aria-label="Go to platform" className={styles['logo-link']}>
        <span className={styles.halo} aria-hidden />
        <Image
          alt="Scheduler logo"
          src="/med-logo.png"
          width={112}
          height={112}
          className={styles.logo}
          priority
        />
      </Link>
      <span className={styles.wordmark}>Scheduler</span>
      <p className={styles.subtitle}>
        Schedule of lessons, lectures, exams and events
      </p>
    </header>
  );
};

export default ScheduleHero;
