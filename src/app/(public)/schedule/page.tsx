import { Suspense } from 'react';
import type { Metadata } from 'next';
import ScheduleHero from '@/components/schedule/ScheduleHero';
import QuerySyncedCalendar from '@/components/lessons/QuerySyncedCalendar';
import BackToPlatformButton from '@/components/schedule/BackToPlatformButton';
import Loading from '@/components/ui/Loading';
import LanguageSwitch from '@/components/layout/LanguageSwitch';
import { getServerTranslation } from '@/i18n/server';

import styles from './styles.module.scss';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerTranslation('public');
  return { title: `${t('scheduleTitle')} · ${t('title')}`, };
};

const CALENDAR_HEIGHT = 'clamp(520px, calc(100dvh - 32px), 1080px)';

const SchedulePage = () => {
  return (
    <div className={styles.page}>
      <LanguageSwitch />
      <ScheduleHero />
      <main className={styles.content}>
        <Suspense fallback={<Loading />}>
          <QuerySyncedCalendar height={CALENDAR_HEIGHT} view={'all'} />
        </Suspense>
      </main>
      <BackToPlatformButton />
    </div>
  );
};

export default SchedulePage;
