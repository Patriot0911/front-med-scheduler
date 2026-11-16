'use client';

import { useTranslation } from 'react-i18next';
import useTeachersDictionaryQuery from '@/hooks/queries/dictionaries/useTeachersDictionaryQuery';

/** Teacher id → full name (from the cached /dictionaries/teachers list). */
const TeacherNameCell = ({ teacherId, emptyText, }: { teacherId: string | null; emptyText?: string }) => {
  const { t, } = useTranslation('dictionaries');
  const { data: teachers, } = useTeachersDictionaryQuery(!!teacherId);

  if (!teacherId) {
    return <span style={{ color: 'var(--color-text-muted)' }}>{emptyText ?? t('notAssigned')}</span>;
  }

  return <>{teachers?.find((teacher) => teacher.id === teacherId)?.name ?? '…'}</>;
}

export default TeacherNameCell;
