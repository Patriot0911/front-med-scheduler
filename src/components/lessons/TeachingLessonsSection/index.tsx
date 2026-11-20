'use client';

import { useTranslation } from 'react-i18next';
import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import useTabParam from '@/hooks/shared/useTabParam';
import Loading from '@/components/ui/Loading';
import Tabs from '@/components/ui/Tabs';
import type { ITabItem } from '@/interfaces/ui/tabs';
import type { TLessonsMode } from '@/interfaces/lessons/filters';
import type { TTeachingLessonsTab } from '@/interfaces/lessons/sections';
import LessonsBrowser from '../LessonsBrowser';
import LessonsModeSwitch from '../LessonsModeSwitch';
import LessonsListPanel, { LESSONS_LIST_TABS } from '../LessonsListPanel';

import styles from './styles.module.scss';

const TEACHER_TABS: TTeachingLessonsTab[] = ['teaching'];
const HEAD_TABS: TTeachingLessonsTab[] = ['teaching', 'department'];
const MODES: TLessonsMode[] = ['calendar', 'list'];
const LIST_TAB_PARAM = 'list';

const TeachingLessonsSection = () => {
  const { t, } = useTranslation('lessons');
  const { data: user, } = useMeQuery();
  const isHead = !!user?.teacher?.headOfDepartmentId;
  const { tab = 'teaching', setTab, } = useTabParam(isHead ? HEAD_TABS : TEACHER_TABS);
  const { tab: mode = 'calendar', setTab: setMode, } = useTabParam(MODES, 'mode');
  const { tab: listTab, } = useTabParam(LESSONS_LIST_TABS, LIST_TAB_PARAM);
  const isGroupsList = mode === 'list' && listTab === 'lesson-groups';

  if (!user) {
    return <Loading />;
  }

  if (!user.teacher) {
    return (
      <p className={styles.empty}>
        {t('sections.teaching.noProfile')}
      </p>
    );
  }

  return (
    <section className={styles.section}>
      {isHead && (
        <Tabs
          items={HEAD_TABS.map((key): ITabItem<TTeachingLessonsTab> => ({ key, data: key, label: t(`sections.teaching.tabs.${key}`), }))}
          value={tab}
          onChange={setTab}
          variant={'underline'}
        />
      )}
      <div className={styles.header}>
        <p className={styles.description}>
          {t(`sections.teaching.description.${isGroupsList ? 'lessonGroups' : tab}`)}
        </p>
        <LessonsModeSwitch value={mode} onChange={setMode} />
      </div>
      {mode === 'calendar'
        ? <LessonsBrowser view={tab} />
        : (
          <LessonsListPanel
            view={tab}
            canEdit
            groupsSource={'usable'}
            canManageGroups={false}
            tabParam={LIST_TAB_PARAM}
          />
        )}
    </section>
  );
}

export default TeachingLessonsSection;
