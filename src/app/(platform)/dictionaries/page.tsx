import RequireAuth from '@/components/auth/RequireAuth';
import DictionarySection from '@/components/dictionaries/DictionarySection';
import Heading from '@/components/ui/headings/Heading';

const DictionariesPage = () => {
  return (
    <RequireAuth shouldRedirect>
      <Heading level={1}>Dictionary</Heading>
      <DictionarySection />
    </RequireAuth>
  );
}

export default DictionariesPage;
