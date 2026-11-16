'use client';

import { useTranslation } from 'react-i18next';
import { Permission } from '@/interfaces/auth/permission';
import type { TLessonsMode } from '@/interfaces/lessons/filters';
import type { TAdminLessonsTab } from '@/interfaces/lessons/sections';
import type { ITabItem } from '@/interfaces/ui/tabs';
import usePermissions from '@/hooks/queries/auth/usePermissions';
import useTabParam from '@/hooks/shared/useTabParam';
import Loading from '@/components/ui/Loading';
import Tabs from '@/components/ui/Tabs';
import LessonsBrowser from '../LessonsBrowser';
import LessonsModeSwitch from '../LessonsModeSwitch';
import AdminLessonGroupsList from '../AdminLessonGroupsList';

import styles from './styles.module.scss';

const READ_PERMISSIONS = [Permission.READ_LESSONS, Permission.MANAGE_LESSONS, Permission.ADMIN];
const MANAGE_PERMISSIONS = [Permission.MANAGE_LESSONS, Permission.ADMIN];

const MODES: TLessonsMode[] = ['calendar', 'list'];
const LIST_TAB_KEYS: TAdminLessonsTab[] = ['lessons', 'lesson-groups'];
const LIST_TAB_LABELS = {
  lessons: 'sections.admin.tabs.lessons',
  'lesson-groups': 'sections.admin.tabs.lessonGroups',
} as const satisfies Record<TAdminLessonsTab, string>;

const AdminLessonsSection = () => {
  const { t, } = useTranslation('lessons');
  const { hasAny, isReady, } = usePermissions();
  const { tab: mode = 'calendar', setTab: setMode, } = useTabParam(MODES, 'mode');
  const { tab: listTab = 'lessons', setTab: setListTab, } = useTabParam(LIST_TAB_KEYS);

  if (!isReady) {
    return <Loading />;
  }

  if (!hasAny(READ_PERMISSIONS)) {
    return (
      <p className={styles.empty}>
        {t('sections.admin.noAccess')}
      </p>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.description}>
          {hasAny(MANAGE_PERMISSIONS)
            ? t('sections.admin.descriptionManage')
            : t('sections.admin.descriptionView')}
        </p>
        <LessonsModeSwitch value={mode} onChange={setMode} />
      </div>
      {mode === 'calendar'
        ? <LessonsBrowser view={'admin'} canEdit={hasAny(MANAGE_PERMISSIONS)} />
        : (
          <>
            <Tabs
              items={LIST_TAB_KEYS.map((key): ITabItem<TAdminLessonsTab> => ({ key, data: key, label: t(LIST_TAB_LABELS[key]), }))}
              value={listTab}
              onChange={setListTab}
              variant={'underline'}
            />
            {listTab === 'lessons'
              ? <LessonsBrowser view={'admin'} mode={'list'} canEdit={hasAny(MANAGE_PERMISSIONS)} />
              : <AdminLessonGroupsList canManage={hasAny(MANAGE_PERMISSIONS)} />}
          </>
        )}
    </section>
  );
}

export default AdminLessonsSection;
