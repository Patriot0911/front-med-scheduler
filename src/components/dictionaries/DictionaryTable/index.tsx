'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LuPencil, LuTrash2 } from 'react-icons/lu';
import Table from '@/components/ui/Table';
import { dictionariesConfig } from '@/configs/dictionaries.config';
import useDictionariesTableQuery from '@/hooks/queries/dictionaries/useDictionariesTableQuery';
import { IDictionaryRow, IDictionaryTableProps } from '@/interfaces/dictionaries/tables';
import { ITableAction, ITableColumn, ITableRowLock } from '@/interfaces/ui/table';

const DictionaryTable = ({
  selectedDictionaryKey,
  page,
  search,
  canManage,
  onPageChange,
  onEdit,
  onDelete,
  onRowAction,
}: IDictionaryTableProps) => {
  const { t, } = useTranslation('dictionaries');
  const config = dictionariesConfig[selectedDictionaryKey];
  const { data, isLoading, isFetching, } = useDictionariesTableQuery(selectedDictionaryKey, page, search);
  const total = data?.meta.count ?? 0;

  const columns = useMemo<ITableColumn<IDictionaryRow>[]>(
    () => config.columns.map((column) => ({ ...column, title: t(column.title), })),
    [config, t],
  );
  const rowLock: ITableRowLock<IDictionaryRow> | undefined = config.rowLock && {
    isLocked: config.rowLock.isLocked,
    reason: t(config.rowLock.reason),
  };

  const actions: ITableAction<IDictionaryRow>[] | undefined = canManage
    ? [
      {
        key: 'edit',
        icon: <LuPencil />,
        label: t(`${selectedDictionaryKey}.edit`),
        onClick: onEdit,
      },
      ...(config.rowActions ?? []).map(({ key, icon, label, }) => ({
        key,
        icon,
        label: t(label),
        onClick: (row: IDictionaryRow) => onRowAction(key, row),
      })),
      {
        key: 'delete',
        icon: <LuTrash2 />,
        label: t(`${selectedDictionaryKey}.delete`),
        variant: 'danger',
        onClick: onDelete,
      },
    ]
    : undefined;

  return (
    <Table<IDictionaryRow>
      columns={columns}
      actions={actions}
      rowKey={(row) => row.id}
      data={data?.items ?? []}
      skeletonRows={5}
      pageSize={config.pageSize}
      isLoading={isLoading}
      emptyText={search ? t('nothingFoundFor', { search, }) : t(`${selectedDictionaryKey}.empty`)}
      onRowClick={canManage ? onEdit : undefined}
      rowLock={canManage ? rowLock : undefined}
      pagination={{
        page,
        total,
        onChange: onPageChange,
        disabled: isFetching,
      }}
    >
      <Table.Header />
      <Table.Body />
    </Table>
  );
}

export default DictionaryTable;
