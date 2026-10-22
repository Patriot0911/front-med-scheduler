import type { IUser } from '@/interfaces/users/users';
import ChipsCell from '@/components/dictionaries/cells/ChipsCell';

/** Which profiles the user has; their department / group have own columns. */
const UserProfilesCell = ({ user }: { user: IUser }) => {
  const items: string[] = [];
  if (user.teacher) items.push('Teacher');
  if (user.student) items.push('Student');

  return <ChipsCell items={items} emptyText={'No profile'} />;
}

export default UserProfilesCell;
