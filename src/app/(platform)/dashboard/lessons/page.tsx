import { Suspense } from 'react';
import AllLessonsSection from '@/components/lessons/AllLessonsSection';
import { getServerTranslation } from '@/i18n/server';
import Heading from '@/components/ui/headings/Heading';
import Loading from '@/components/ui/Loading';

const LessonsPage = async () => {
  const t = await getServerTranslation('layout');

  return (
    <>
      <Heading level={1}>{t('pages.allLessons')}</Heading>
      <Suspense fallback={<Loading />}>
        <AllLessonsSection />
      </Suspense>
    </>
  );
}

export default LessonsPage;
