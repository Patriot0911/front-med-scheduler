'use client';

import useTeachersDictionaryQuery from '@/hooks/queries/dictionaries/useTeachersDictionaryQuery';

/** Teacher id → full name (from the cached /dictionaries/teachers list). */
const TeacherNameCell = ({ teacherId, emptyText = 'Not assigned' }: { teacherId: string | null; emptyText?: string }) => {
  const { data: teachers, } = useTeachersDictionaryQuery(!!teacherId);

  if (!teacherId) {
    return <span style={{ color: 'var(--color-text-muted)' }}>{emptyText}</span>;
  }

  return <>{teachers?.find((teacher) => teacher.id === teacherId)?.name ?? '…'}</>;
}

export default TeacherNameCell;
