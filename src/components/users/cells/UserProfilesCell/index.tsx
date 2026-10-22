'use client';

import type { IUser } from '@/interfaces/users/users';
import useDepartmentsDictionaryQuery from '@/hooks/queries/dictionaries/useDepartmentsDictionaryQuery';
import useStudentGroupsDictionaryQuery from '@/hooks/queries/dictionaries/useStudentGroupsDictionaryQuery';
import ChipsCell from '@/components/dictionaries/cells/ChipsCell';

/** Teacher / student profiles with their department and group names. */
const UserProfilesCell = ({ user }: { user: IUser }) => {
  const { teacher, student, } = user;
  const { data: departments, } = useDepartmentsDictionaryQuery(!!teacher?.departmentId);
  const { data: groups, } = useStudentGroupsDictionaryQuery(!!student?.studentGroupId);

  const items: string[] = [];
  if (teacher) {
    const department = departments?.find((item) => item.id === teacher.departmentId)?.name;
    items.push(teacher.departmentId ? `Teacher · ${department ?? '…'}` : 'Teacher');
  }
  if (student) {
    const group = groups?.find((item) => item.id === student.studentGroupId)?.name;
    items.push(student.studentGroupId ? `Student · ${group ?? '…'}` : 'Student');
    if (student.isGroupMonitor) items.push('Group monitor');
  }

  return <ChipsCell items={items} emptyText={'No profile'} />;
}

export default UserProfilesCell;
