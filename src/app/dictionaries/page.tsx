import RequireAuth from '@/components/auth/RequireAuth';
import DictionaryTable from '@/components/dictionaries/DictionaryTable';

const DictionariesPage = () => {
  return (
    <RequireAuth shouldRedirect>
      <div>Parameters Page</div>
      <DictionaryTable
        selectedDictionaryKey={'roles'}
      />
    </RequireAuth>
  );
}

export default DictionariesPage;
