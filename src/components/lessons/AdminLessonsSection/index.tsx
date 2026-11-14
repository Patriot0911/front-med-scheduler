'use client';

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
const LIST_TABS: ITabItem<TAdminLessonsTab>[] = [
  { key: 'lessons', data: 'lessons', label: 'Lessons', },
  { key: 'lesson-groups', data: 'lesson-groups', label: 'Lesson groups', },
];
const LIST_TAB_KEYS = LIST_TABS.map(({ data, }) => data);

const AdminLessonsSection = () => {
  const { hasAny, isReady, } = usePermissions();
  const { tab: mode = 'calendar', setTab: setMode, } = useTabParam(MODES, 'mode');
  const { tab: listTab = 'lessons', setTab: setListTab, } = useTabParam(LIST_TAB_KEYS);

  if (!isReady) {
    return <Loading />;
  }

  if (!hasAny(READ_PERMISSIONS)) {
    return (
      <p className={styles.empty}>
        You don&apos;t have access to lessons management. Ask an administrator for permissions.
      </p>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.description}>
          {hasAny(MANAGE_PERMISSIONS)
            ? 'Every lesson of the platform, public or not, whoever teaches it. You can edit any of them.'
            : 'Every lesson of the platform, public or not, whoever teaches it. View only.'}
        </p>
        <LessonsModeSwitch value={mode} onChange={setMode} />
      </div>
      {mode === 'calendar'
        ? <LessonsBrowser view={'admin'} canEdit={hasAny(MANAGE_PERMISSIONS)} />
        : (
          <>
            <Tabs
              items={LIST_TABS}
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
