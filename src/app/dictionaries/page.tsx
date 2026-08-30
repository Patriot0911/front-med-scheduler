import RequireAuth from '@/components/auth/RequireAuth';
import DictionaryTable from '@/components/dictionaries/DictionaryTable';
import BaseLayout from '@/components/layout/BaseLayout';

const DictionariesPage = () => {
  return (
    <RequireAuth shouldRedirect>
      <BaseLayout>
        <div>Parameters Page</div>
        <DictionaryTable
          selectedDictionaryKey={'roles'}
        />
      </BaseLayout>
    </RequireAuth>
  );
}

export default DictionariesPage;
