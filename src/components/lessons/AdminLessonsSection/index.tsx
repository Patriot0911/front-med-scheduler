'use client';

import { Permission } from '@/interfaces/auth/permission';
import usePermissions from '@/hooks/queries/auth/usePermissions';
import Loading from '@/components/ui/Loading';
import QuerySyncedCalendar from '../QuerySyncedCalendar';

import styles from './styles.module.scss';

const READ_PERMISSIONS = [Permission.READ_LESSONS, Permission.MANAGE_LESSONS, Permission.ADMIN];
const MANAGE_PERMISSIONS = [Permission.MANAGE_LESSONS, Permission.ADMIN];

const AdminLessonsSection = () => {
  const { hasAny, isReady, } = usePermissions();

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
      <p className={styles.description}>
        {hasAny(MANAGE_PERMISSIONS)
          ? 'Every lesson of the platform, public or not, whoever teaches it. You can edit any of them.'
          : 'Every lesson of the platform, public or not, whoever teaches it. View only.'}
      </p>
      <QuerySyncedCalendar />
    </section>
  );
}

export default AdminLessonsSection;
