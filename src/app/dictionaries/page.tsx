import RequireAuth from '@/components/auth/RequireAuth';
import DictionarySection from '@/components/dictionaries/DictionarySection';
import BaseLayout from '@/components/layout/BaseLayout';
import Heading from '@/components/ui/headings/Heading';

const DictionariesPage = () => {
  return (
    <RequireAuth shouldRedirect>
      <BaseLayout>
        <Heading level={1}>Parameters Page</Heading>
        <DictionarySection />
      </BaseLayout>
    </RequireAuth>
  );
}

export default DictionariesPage;
