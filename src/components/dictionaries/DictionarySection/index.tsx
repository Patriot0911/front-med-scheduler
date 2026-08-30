'use client';

import { useState } from 'react';
import DictionaryTable from '../DictionaryTable';
import { TDictionaryKey } from '@/interfaces/dictionaries/tables';
import SubHeading from '@/components/ui/headings/SubHeading';
import { dictionariesConfig } from '@/configs/dictionaries.config';

const DictionarySection = () => {
  const [selectedDictionaryKey, setSelectedDictionaryKey] = useState<TDictionaryKey>('roles');
  return (
    <>
      <SubHeading level={2}>
        test
        {dictionariesConfig[selectedDictionaryKey].title ?? 'Dictionary'}
      </SubHeading>
      <DictionaryTable
        selectedDictionaryKey={selectedDictionaryKey}
      />
    </>
  );
}

export default DictionarySection;
