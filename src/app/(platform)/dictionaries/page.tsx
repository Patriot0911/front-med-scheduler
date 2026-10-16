import { Suspense } from 'react';
import RequireAuth from '@/components/auth/RequireAuth';
import DictionarySection from '@/components/dictionaries/DictionarySection';
import Heading from '@/components/ui/headings/Heading';
import Loading from '@/components/ui/Loading';

const DictionariesPage = () => {
  return (
    <RequireAuth shouldRedirect>
      <Heading level={1}>Dictionaries</Heading>
      <Suspense fallback={<Loading />}>
        <DictionarySection />
      </Suspense>
    </RequireAuth>
  );
}

export default DictionariesPage;
