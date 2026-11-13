'use client';

import { useState } from 'react';
import { LuSearch, LuX } from 'react-icons/lu';
import useDebouncedValue from '@/hooks/shared/useDebouncedValue';
import Input from '@/components/ui/Input';
import LessonGroupsTable from '../LessonGroupsTable';

import styles from './styles.module.scss';

const AdminLessonGroupsList = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim());
  const [pageState, setPageState] = useState({ search: '', page: 1, });
  const page = pageState.search === debouncedSearch ? pageState.page : 1;

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
      />
    </div>
  );
}

export default AdminLessonGroupsList;
