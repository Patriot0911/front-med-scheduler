'use client';

import { useState } from 'react';
import DictionaryTable from '../DictionaryTable';
import { TDictionaryKey } from '@/interfaces/dictionaries/tables';
import SubHeading from '@/components/ui/headings/SubHeading';
import { dictionariesConfig } from '@/configs/dictionaries.config';
import Tabs from '@/components/ui/Tabs';
import DictionaryTabItem from '../DictionaryTabItem';
import { ITabItem } from '@/interfaces/ui/tabs';

const DictionarySection = () => {
  const [selectedDictionaryKey, setSelectedDictionaryKey] = useState<TDictionaryKey>('roles');
  const tabsItems: ITabItem[] = Object.keys(dictionariesConfig).map((key) => ({
    key,
    data: key,
    label: dictionariesConfig[key as TDictionaryKey].title,
  }));

  return (
    <>
      <SubHeading level={2}>
        {dictionariesConfig[selectedDictionaryKey].title ?? ' '}
      </SubHeading>
      <Tabs
        items={tabsItems}
        value={selectedDictionaryKey}
        renderItem={
          (item) => DictionaryTabItem({
            title: item.label,
            key: item.key as TDictionaryKey,
            icon: dictionariesConfig[item.key as TDictionaryKey].icon,
          })
        }
        onChange={(item) => setSelectedDictionaryKey(item as TDictionaryKey)}
      />
      <DictionaryTable
        selectedDictionaryKey={selectedDictionaryKey}
      />
    </>
  );
}

export default DictionarySection;
