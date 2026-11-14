'use client';

import { useMemo, useState } from 'react';
import dayjs from '@/lib/dayjs';
import { LESSONS_VIEWS } from '@/configs/lessons-views.config';
import useLessonsFiltersParams from '@/hooks/lessons/useLessonsFiltersParams';
import { toLessonsParams } from '@/lib/lessons-filters';
import { nextHourLessonDraft, slotToLessonDraft } from '@/lib/lessons-calendar';
import type { ILessonDraft } from '@/interfaces/lessons/lesson';
import type { ILessonsBrowserProps } from '@/interfaces/lessons/filters';
import { LuPlus } from 'react-icons/lu';
import Button from '@/components/ui/Button';
import Switch from '@/components/ui/Switch';
import LessonFormModal from '../LessonFormModal';
import LessonsToolbar from '../LessonsToolbar';
import LessonsTable from '../LessonsTable';
import QuerySyncedCalendar from '../QuerySyncedCalendar';

import styles from './styles.module.scss';

type TFormState = { isOpen: boolean; draft: ILessonDraft | null };

const LessonsBrowser = ({ view, mode = 'calendar', }: ILessonsBrowserProps) => {
  const { filters: filterKeys, canCreate, } = LESSONS_VIEWS[view];
  // the draft is kept after closing so the modal keeps its content during the exit animation
  const [form, setForm] = useState<TFormState>({ isOpen: false, draft: null, });
  const openForm = (draft: ILessonDraft) => setForm({ isOpen: true, draft, });
  const { filters, search, setFilters, setSearch, } = useLessonsFiltersParams(filterKeys);
  const [includePast, setIncludePast] = useState(false);

  const listParams = useMemo(() => ({
    ...toLessonsParams(filters, search),
    ...(includePast ? {} : { dateFrom: dayjs().startOf('day').toISOString(), }),
  }), [filters, search, includePast]);

  // back to the first page whenever the query changes, without an effect
  const paramsKey = JSON.stringify(listParams);
  const [pageState, setPageState] = useState({ key: paramsKey, page: 1, });
  const page = pageState.key === paramsKey ? pageState.page : 1;

  return (
    <div className={styles.browser}>
      <LessonsToolbar
        filterKeys={filterKeys}
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFiltersApply={setFilters}
      >
        {mode === 'list' && (
          <Switch
            checked={includePast}
            onChange={setIncludePast}
            label={'Include past lessons'}
          />
        )}
        {canCreate && (
          <Button
            leftIcon={<LuPlus />}
            onClick={() => openForm(nextHourLessonDraft())}
            className={styles['create-button']}
          >
            Add lesson
          </Button>
        )}
      </LessonsToolbar>
      {mode === 'calendar'
        ? (
          <QuerySyncedCalendar
            view={view}
            filters={filters}
            search={search}
            onSlotSelect={canCreate ? (slot) => openForm(slotToLessonDraft(slot)) : undefined}
          />
        )
        : (
          <LessonsTable
            view={view}
            params={listParams}
            page={page}
            onPageChange={(next) => setPageState({ key: paramsKey, page: next, })}
          />
        )}
      {canCreate && (
        <LessonFormModal
          isOpen={form.isOpen}
          draft={form.draft}
          isDepartmentLesson={view === 'department'}
          onClose={() => setForm((prev) => ({ ...prev, isOpen: false, }))}
        />
      )}
    </div>
  );
}

export default LessonsBrowser;
