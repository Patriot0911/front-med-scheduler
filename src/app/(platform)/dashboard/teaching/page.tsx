import { Suspense } from 'react';
import TeachingLessonsSection from '@/components/lessons/TeachingLessonsSection';
import { getServerTranslation } from '@/i18n/server';
import Heading from '@/components/ui/headings/Heading';
import Loading from '@/components/ui/Loading';

const TeachingPage = async () => {
  const t = await getServerTranslation('layout');

  return (
    <>
      <Heading level={1}>{t('pages.teaching')}</Heading>
      <Suspense fallback={<Loading />}>
        <TeachingLessonsSection />
      </Suspense>
    </>
  );
}

export default TeachingPage;
