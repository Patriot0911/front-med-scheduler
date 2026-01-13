import DictionaryTable from '@/components/dictionaries/DictionaryTable';

const DictionariesPage = () => {
  return (
    <>
      <div>Parameters Page</div>
      <DictionaryTable
        selectedDictionaryKey={'roles'}
      />
    </>
  );
}

export default DictionariesPage;
