'use client';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { dictionariesConfig } from '@/configs/dictionaries.config';
import { IDictionaryRow, TDictionaryKey } from '@/interfaces/dictionaries/tables';
import useDebouncedValue from '@/hooks/shared/useDebouncedValue';
import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import { mutationToLoadingState } from '@/lib/loading-mappers';
import SubHeading from '@/components/ui/headings/SubHeading';
import ConfirmModal from '@/components/modals/ConfirmModal';
import DictionaryToolbar from '../DictionaryToolbar';
import DictionaryTable from '../DictionaryTable';

import styles from './styles.module.scss';

interface IDictionaryTabPanelProps {
  dictionaryKey: TDictionaryKey;
  canManage: boolean;
};

type TFormState = { isOpen: boolean; item: IDictionaryRow | null };
type TRowActionState = { key: string | null; item: IDictionaryRow | null };

/** Content of one dictionary tab. Mounted per tab (keyed by it), so paging / search start fresh. */
const DictionaryTabPanel = ({ dictionaryKey, canManage, }: IDictionaryTabPanelProps) => {
  const { t, } = useTranslation('dictionaries');
  const config = dictionariesConfig[dictionaryKey];

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim());
  const [form, setForm] = useState<TFormState>({ isOpen: false, item: null, });
  const [itemToDelete, setItemToDelete] = useState<IDictionaryRow | null>(null);
  // the item is kept after closing so the modal keeps its content during the exit animation
  const [rowAction, setRowAction] = useState<TRowActionState>({ key: null, item: null, });

  const deleteMutation = useDictionaryMutation({
    mutationFn: (item: IDictionaryRow) => config.remove(item.id),
    invalidateKeys: [config.queryKey, ...(config.relatedQueryKeys ?? [])],
    successMessage: t(`${dictionaryKey}.deleted`),
    onSuccess: () => setItemToDelete(null),
  });

  const FormModal = config.FormModal;

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <SubHeading level={2}>{t(`${dictionaryKey}.title`)}</SubHeading>
        <p className={styles.description}>{t(`${dictionaryKey}.description`)}</p>
      </header>

      <DictionaryToolbar
        search={search}
        onSearchChange={(next) => {
          setSearch(next);
          setPage(1);
        }}
        addLabel={t(`${dictionaryKey}.add`)}
        canManage={canManage}
        onCreate={() => setForm({ isOpen: true, item: null, })}
      />

      <DictionaryTable
        selectedDictionaryKey={dictionaryKey}
        page={page}
        search={debouncedSearch}
        canManage={canManage}
        onPageChange={setPage}
        onEdit={(item) => setForm({ isOpen: true, item, })}
        onDelete={(item) => {
          deleteMutation.reset();
          setItemToDelete(item);
        }}
        onRowAction={(key, item) => setRowAction({ key, item, })}
      />

      <FormModal
        isOpen={form.isOpen}
        item={form.item}
        onClose={() => setForm((prev) => ({ ...prev, isOpen: false, }))}
      />

      {config.rowActions?.map(({ key, Modal: RowActionModal, }) => (
        <RowActionModal
          key={key}
          isOpen={rowAction.key === key}
          item={rowAction.item}
          onClose={() => setRowAction((prev) => ({ ...prev, key: null, }))}
        />
      ))}

      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => itemToDelete && deleteMutation.mutate(itemToDelete)}
        requestState={mutationToLoadingState(deleteMutation)}
        description={itemToDelete
          ? t(`${dictionaryKey}.confirmDelete`, { name: config.getItemLabel(itemToDelete), })
          : undefined}
      />
    </div>
  );
}

export default DictionaryTabPanel;
