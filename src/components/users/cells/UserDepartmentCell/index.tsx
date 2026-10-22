'use client';

import type { ITeacherProfile } from '@/interfaces/users/users';
import useDepartmentsDictionaryQuery from '@/hooks/queries/dictionaries/useDepartmentsDictionaryQuery';

import styles from '../styles/empty.module.scss';

/** Department of the teacher profile (from the cached /dictionaries/departments list). */
const UserDepartmentCell = ({ teacher }: { teacher: ITeacherProfile | null }) => {
  const departmentId = teacher?.departmentId;
  const { data: departments, } = useDepartmentsDictionaryQuery(!!departmentId);

  if (!teacher) {
    return <span className={styles.empty}>—</span>;
  }
  if (!departmentId) {
    return <span className={styles.empty}>Not assigned</span>;
  }

  return <>{departments?.find((department) => department.id === departmentId)?.name ?? '…'}</>;
}

export default UserDepartmentCell;
