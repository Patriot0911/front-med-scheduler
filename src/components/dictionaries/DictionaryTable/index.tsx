'use client';

import { LuPencil, LuTrash2 } from 'react-icons/lu';
import Table from '@/components/ui/Table';
import { dictionariesConfig } from '@/configs/dictionaries.config';
import useDictionariesTableQuery from '@/hooks/queries/dictionaries/useDictionariesTableQuery';
import { IDictionaryRow, IDictionaryTableProps } from '@/interfaces/dictionaries/tables';
import { ITableAction } from '@/interfaces/ui/table';

const DictionaryTable = ({
  selectedDictionaryKey,
  page,
  search,
  canManage,
  onPageChange,
  onEdit,
  onDelete,
}: IDictionaryTableProps) => {
  const config = dictionariesConfig[selectedDictionaryKey];
  const { data, isLoading, isFetching, } = useDictionariesTableQuery(selectedDictionaryKey, page, search);
  const total = data?.meta.count ?? 0;

  const actions: ITableAction<IDictionaryRow>[] | undefined = canManage
    ? [
      {
        key: 'edit',
        icon: <LuPencil />,
        label: `Edit ${config.itemName}`,
        onClick: onEdit,
      },
      {
        key: 'delete',
        icon: <LuTrash2 />,
        label: `Delete ${config.itemName}`,
        variant: 'danger',
        onClick: onDelete,
      },
    ]
    : undefined;

  return (
    <Table<IDictionaryRow>
      columns={config.columns}
      actions={actions}
      rowKey={(row) => row.id}
      data={data?.items ?? []}
      skeletonRows={5}
      isLoading={isLoading}
      emptyText={search ? `Nothing found for “${search}”` : `No ${config.title.toLowerCase()} yet`}
      onRowClick={canManage ? onEdit : undefined}
      pagination={total > config.pageSize ? {
        page,
        pageSize: config.pageSize,
        total,
        onChange: onPageChange,
        disabled: isFetching,
      } : undefined}
    >
      <Table.Header />
      <Table.Body />
    </Table>
  );
}

export default DictionaryTable;
