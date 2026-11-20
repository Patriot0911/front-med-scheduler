'use client';

import { useTranslation } from 'react-i18next';
import useTabParam from '@/hooks/shared/useTabParam';
import Tabs from '@/components/ui/Tabs';
import type { ITabItem } from '@/interfaces/ui/tabs';
import type { ILessonsListPanelProps, TLessonsListTab } from '@/interfaces/lessons/sections';
import LessonsBrowser from '../LessonsBrowser';
import LessonGroupsList from '../LessonGroupsList';

export const LESSONS_LIST_TABS: TLessonsListTab[] = ['lessons', 'lesson-groups'];
const TAB_LABELS = {
  lessons: 'listMode.tabs.lessons',
  'lesson-groups': 'listMode.tabs.lessonGroups',
} as const satisfies Record<TLessonsListTab, string>;

/** The list mode of a lessons section: lessons and lesson groups as tables */
const LessonsListPanel = ({ view, canEdit, groupsSource, canManageGroups, tabParam, }: ILessonsListPanelProps) => {
  const { t, } = useTranslation('lessons');
  const { tab = 'lessons', setTab, } = useTabParam(LESSONS_LIST_TABS, tabParam);

  return (
    <>
      <Tabs
        items={LESSONS_LIST_TABS.map((key): ITabItem<TLessonsListTab> => ({ key, data: key, label: t(TAB_LABELS[key]), }))}
        value={tab}
        onChange={setTab}
        variant={'underline'}
      />
      {tab === 'lessons'
        ? <LessonsBrowser view={view} mode={'list'} canEdit={canEdit} />
        : <LessonGroupsList source={groupsSource} canManage={canManageGroups} />}
    </>
  );
}

export default LessonsListPanel;
