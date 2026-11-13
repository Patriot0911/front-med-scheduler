import { Suspense } from 'react';
import DictionarySection from '@/components/dictionaries/DictionarySection';
import Heading from '@/components/ui/headings/Heading';
import Loading from '@/components/ui/Loading';

const DictionariesPage = () => {
  return (
    <>
      <Heading level={1}>Dictionaries</Heading>
      <Suspense fallback={<Loading />}>
        <DictionarySection />
      </Suspense>
    </>
  );
}

export default DictionariesPage;
