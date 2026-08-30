'use client';

import { useState } from 'react';
import DictionaryTable from '../DictionaryTable';
import { TDictionaryKey } from '@/interfaces/dictionaries/tables';

const DictionarySection = () => {
  const [selectedDictionaryKey, setSelectedDictionaryKey] = useState<TDictionaryKey>('roles');
  return (
    <>
      <DictionaryTable
        selectedDictionaryKey={selectedDictionaryKey}
      />
    </>
  );
}

export default DictionarySection;
