import type { Metadata } from 'next';
import ScheduleHero from '@/components/schedule/ScheduleHero';
import BackToPlatformButton from '@/components/schedule/BackToPlatformButton';
import LessonsSection from '@/components/lessons/LessonsSection';

import styles from './styles.module.scss';

export const metadata: Metadata = {
  title: 'Schedule · Med Scheduler',
};

const CALENDAR_HEIGHT = 'clamp(520px, calc(100dvh - 32px), 1080px)';

const SchedulePage = () => {
  return (
    <div className={styles.page}>
      <ScheduleHero />
      <main className={styles.content}>
        <LessonsSection height={CALENDAR_HEIGHT} />
      </main>
      <BackToPlatformButton />
    </div>
  );
};

export default SchedulePage;
