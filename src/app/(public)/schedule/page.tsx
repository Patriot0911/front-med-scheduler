import { Suspense } from 'react';
import type { Metadata } from 'next';
import ScheduleHero from '@/components/schedule/ScheduleHero';
import QuerySyncedCalendar from '@/components/lessons/QuerySyncedCalendar';
import BackToPlatformButton from '@/components/schedule/BackToPlatformButton';
import Loading from '@/components/ui/Loading';

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
        <Suspense fallback={<Loading />}>
          <QuerySyncedCalendar height={CALENDAR_HEIGHT} />
        </Suspense>
      </main>
      <BackToPlatformButton />
    </div>
  );
};

export default SchedulePage;
