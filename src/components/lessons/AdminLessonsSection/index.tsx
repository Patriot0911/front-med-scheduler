'use client';

import { useTranslation } from 'react-i18next';
import { Permission } from '@/interfaces/auth/permission';
import type { TLessonsMode } from '@/interfaces/lessons/filters';
import usePermissions from '@/hooks/queries/auth/usePermissions';
import useTabParam from '@/hooks/shared/useTabParam';
import Loading from '@/components/ui/Loading';
import LessonsBrowser from '../LessonsBrowser';
import LessonsModeSwitch from '../LessonsModeSwitch';
import LessonsListPanel from '../LessonsListPanel';

import styles from './styles.module.scss';

const READ_PERMISSIONS = [Permission.READ_LESSONS, Permission.MANAGE_LESSONS, Permission.ADMIN];
const MANAGE_PERMISSIONS = [Permission.MANAGE_LESSONS, Permission.ADMIN];

const MODES: TLessonsMode[] = ['calendar', 'list'];

const AdminLessonsSection = () => {
  const { t, } = useTranslation('lessons');
  const { hasAny, isReady, } = usePermissions();
  const { tab: mode = 'calendar', setTab: setMode, } = useTabParam(MODES, 'mode');

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
          <LessonsListPanel
            view={'admin'}
            canEdit={hasAny(MANAGE_PERMISSIONS)}
            groupsSource={'admin'}
            canManageGroups={hasAny(MANAGE_PERMISSIONS)}
            tabParam={'tab'}
          />
        )}
    </section>
  );
}

export default AdminLessonsSection;
