import { Suspense } from 'react';
import StudyLessonsSection from '@/components/lessons/StudyLessonsSection';
import { getServerTranslation } from '@/i18n/server';
import Heading from '@/components/ui/headings/Heading';
import Loading from '@/components/ui/Loading';

const StudyPage = async () => {
  const t = await getServerTranslation('layout');

  return (
    <>
      <Heading level={1}>{t('pages.studying')}</Heading>
      <Suspense fallback={<Loading />}>
        <StudyLessonsSection />
      </Suspense>
    </>
  );
}

export default StudyPage;
