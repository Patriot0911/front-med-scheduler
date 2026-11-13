'use client';

import { Permission } from '@/interfaces/auth/permission';
import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import usePermissions from '@/hooks/queries/auth/usePermissions';
import useDepartmentsDictionaryQuery from '@/hooks/queries/dictionaries/useDepartmentsDictionaryQuery';
import useStudentGroupsDictionaryQuery from '@/hooks/queries/dictionaries/useStudentGroupsDictionaryQuery';
import Avatar from '@/components/ui/Avatar';

import styles from './styles.module.scss';

// mirrors the access of GET /dictionaries/departments
const DEPARTMENTS_PERMISSIONS = [
  Permission.READ_DEPARTMENTS,
  Permission.MANAGE_DEPARTMENTS,
  Permission.READ_USERS,
  Permission.MANAGE_USERS,
  Permission.ADMIN,
];

/** Who the user is in the system: roles and teacher / student profiles. Read only. */
const ProfileSummary = () => {
  const { data: me, } = useMeQuery();
  const { hasAny, } = usePermissions();
  const departmentId = me?.teacher?.departmentId;
  const groupId = me?.student?.studentGroupId;
  const { data: departments, } = useDepartmentsDictionaryQuery(!!departmentId && hasAny(DEPARTMENTS_PERMISSIONS));
  const { data: groups, } = useStudentGroupsDictionaryQuery(!!groupId);

  if (!me) return null;

  const department = departments?.find((item) => item.id === departmentId)?.name;
  const group = groups?.find((item) => item.id === groupId)?.name;

  return (
    <div className={styles.summary}>
      <div className={styles.identity}>
        <Avatar name={me.fullName} size={'lg'} />
        <div className={styles.info}>
          <span className={styles.name}>{me.fullName}</span>
          <div className={styles.contacts}>
            <span className={styles.email}>{me.email}</span>
            {me.roles.map((role) => (
              <span key={role} className={styles.role}>{role}</span>
            ))}
          </div>
        </div>
      </div>
      {(me.teacher || me.student) && (
        <dl className={styles.profiles}>
          {me.teacher && (
            <div className={styles.profile}>
              <dt>Teacher</dt>
              <dd>{department ?? (departmentId ? 'Department assigned' : 'No department')}</dd>
            </div>
          )}
          {me.student && (
            <div className={styles.profile}>
              <dt>Student</dt>
              <dd>
                {group ?? (groupId ? '…' : 'No group')}
                {me.student.isGroupMonitor && <span className={styles.badge}>Monitor</span>}
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}

export default ProfileSummary;
