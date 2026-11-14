'use client';

import { useState } from 'react';
import { LuSearch, LuX } from 'react-icons/lu';
import useDebouncedValue from '@/hooks/shared/useDebouncedValue';
import useAdminLessonGroupsQuery from '@/hooks/queries/lessons/useAdminLessonGroupsQuery';
import type { IAdminLessonGroupsListProps, ILessonGroup } from '@/interfaces/lessons/lesson-group';
import Input from '@/components/ui/Input';
import LessonGroupsTable, { LESSON_GROUPS_PAGE_SIZE } from '../LessonGroupsTable';
import LessonGroupModal from '../LessonGroupModal';
import DeleteLessonGroupModal from '../DeleteLessonGroupModal';

import styles from './styles.module.scss';

type TGroupModalState = { isOpen: boolean; group: ILessonGroup | null };

const AdminLessonGroupsList = ({ canManage, }: IAdminLessonGroupsListProps) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim());
  const [pageState, setPageState] = useState({ search: '', page: 1, });
  const page = pageState.search === debouncedSearch ? pageState.page : 1;
  // the group is kept after closing so the modals keep their content during the exit animation
  const [opened, setOpened] = useState<TGroupModalState>({ isOpen: false, group: null, });
  const [deleting, setDeleting] = useState<TGroupModalState & { session: number }>({ isOpen: false, group: null, session: 0, });

  // the opened group follows the list after edits (name, lessons count, period)
  const { data, } = useAdminLessonGroupsQuery(page, LESSON_GROUPS_PAGE_SIZE, debouncedSearch);
  const fresh = (group: ILessonGroup | null) => (group && data?.items.find(({ id, }) => id === group.id)) ?? group;

  const openDelete = (group: ILessonGroup) => setDeleting((prev) => ({ isOpen: true, group, session: prev.session + 1, }));

  return (
    <div className={styles.browser}>
      <div className={`${styles.search} fields-compact`}>
        <Input
          name={'lesson-groups-search'}
          value={search}
          placeholder={'Search lesson groups…'}
          aria-label={'Search lesson groups'}
          onChange={(e) => setSearch(e.target.value)}
          icon={search ? <LuX /> : <LuSearch />}
          onIconClick={() => setSearch('')}
          hideErrorMessage
        />
      </div>
      <LessonGroupsTable
        search={debouncedSearch}
        page={page}
        onPageChange={(next) => setPageState({ search: debouncedSearch, page: next, })}
        onOpen={(group) => setOpened({ isOpen: true, group, })}
        onDelete={canManage ? openDelete : undefined}
      />
      <LessonGroupModal
        isOpen={opened.isOpen}
        group={fresh(opened.group)}
        canManage={canManage}
        onClose={() => setOpened((prev) => ({ ...prev, isOpen: false, }))}
        onDelete={openDelete}
      />
      <DeleteLessonGroupModal
        key={deleting.session}
        isOpen={deleting.isOpen}
        group={fresh(deleting.group)}
        onClose={() => setDeleting((prev) => ({ ...prev, isOpen: false, }))}
        onDeleted={() => setOpened((prev) => (prev.group?.id === deleting.group?.id ? { ...prev, isOpen: false, } : prev))}
      />
    </div>
  );
}

export default AdminLessonGroupsList;
