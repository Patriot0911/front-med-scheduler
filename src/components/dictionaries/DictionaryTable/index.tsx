'use client';

import Loading from '@/components/ui/Loading';
import Table from '@/components/ui/Table';
import { dictionariesConfig } from '@/configs/dictionaries.config';
import useDictionariesTableQuery from '@/hooks/queries/dictionaries/useDictionariesTableQuery';
import { IRole } from '@/interfaces/dictionaries/roles';
import { IDictionaryTableProps } from '@/interfaces/dictionaries/tables';

const DictionaryTable = ({ selectedDictionaryKey, }: IDictionaryTableProps) => {
  const { data, isLoading, } = useDictionariesTableQuery(selectedDictionaryKey);

  return (
    <Table<IRole>
      columns={dictionariesConfig[selectedDictionaryKey]?.columns || []}
      rowKey={(i) => i.id}
      data={data?.items || []}
      skeletonRows={5}
      isLoading={isLoading}
    >
      <Table.Header />
      <Table.Body />
    </Table>
  );
}

export default DictionaryTable;
