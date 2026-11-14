import { Suspense } from 'react';
import DictionarySection from '@/components/dictionaries/DictionarySection';
import { getServerTranslation } from '@/i18n/server';
import Heading from '@/components/ui/headings/Heading';
import Loading from '@/components/ui/Loading';

const DictionariesPage = async () => {
  const t = await getServerTranslation('layout');

  return (
    <>
      <Heading level={1}>{t('pages.dictionaries')}</Heading>
      <Suspense fallback={<Loading />}>
        <DictionarySection />
      </Suspense>
    </>
  );
}

export default DictionariesPage;
