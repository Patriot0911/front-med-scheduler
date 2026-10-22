import type { IUser } from '@/interfaces/users/users';

import styles from './styles.module.scss';

const UserNameCell = ({ user }: { user: IUser }) => {
  return (
    <div className={styles.cell}>
      <span className={styles.name}>{user.fullName}</span>
      <span className={styles.email}>{user.email}</span>
    </div>
  );
}

export default UserNameCell;
