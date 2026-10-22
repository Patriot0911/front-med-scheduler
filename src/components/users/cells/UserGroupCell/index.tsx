'use client';

import type { IStudentProfile } from '@/interfaces/users/users';
import useStudentGroupsDictionaryQuery from '@/hooks/queries/dictionaries/useStudentGroupsDictionaryQuery';

import emptyStyles from '../styles/empty.module.scss';
import styles from './styles.module.scss';

/** Student group of the student profile (from the cached /dictionaries/group list). */
const UserGroupCell = ({ student }: { student: IStudentProfile | null }) => {
  const groupId = student?.studentGroupId;
  const { data: groups, } = useStudentGroupsDictionaryQuery(!!groupId);

  if (!student) {
    return <span className={emptyStyles.empty}>—</span>;
  }
  if (!groupId) {
    return <span className={emptyStyles.empty}>Not assigned</span>;
  }

  return (
    <span className={styles.group}>
      {groups?.find((group) => group.id === groupId)?.name ?? '…'}
      {student.isGroupMonitor && <span className={styles.monitor}>Monitor</span>}
    </span>
  );
}

export default UserGroupCell;
