'use client';

import { useTranslation } from 'react-i18next';
import type { IUser } from '@/interfaces/users/users';
import ChipsCell from '@/components/dictionaries/cells/ChipsCell';

/** Which profiles the user has; their department / group have own columns. */
const UserProfilesCell = ({ user }: { user: IUser }) => {
  const { t, } = useTranslation('users');
  const items: string[] = [];
  if (user.teacher) items.push(t('profiles.teacher'));
  if (user.student) items.push(t('profiles.student'));

  return <ChipsCell items={items} emptyText={t('profiles.none')} />;
}

export default UserProfilesCell;
