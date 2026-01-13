'use client';

import Table from '@/components/ui/Table';
import { dictionariesConfig } from '@/configs/dictionaries.config';
import useDictionariesTableQuery from '@/hooks/queries/dictionaries/useDictionariesTableQuery';
import { IDictionaryTableProps } from '@/interfaces/dictionaries/tables';

const DictionaryTable = ({ selectedDictionaryKey, }: IDictionaryTableProps) => {
  const { data, isLoading, } = useDictionariesTableQuery(selectedDictionaryKey);
  return (
    <Table
      isLoading={isLoading}
      columns={dictionariesConfig[selectedDictionaryKey].columns}
      data={data?.data.items ?? []}
      rowKey={'id'}
    />
    // Todo: add pagination
  );
}

export default DictionaryTable;
