'use client';

import { useState } from 'react';
import { Permission } from '@/interfaces/auth/permission';
import { IUsersFilters } from '@/interfaces/users/users';
import usePermissions from '@/hooks/queries/auth/usePermissions';
import Loading from '@/components/ui/Loading';
import UsersToolbar from '../UsersToolbar';
import UserFormModal from '../forms/UserFormModal';

import styles from './styles.module.scss';

const READ_PERMISSIONS = [Permission.READ_USERS, Permission.MANAGE_USERS, Permission.ADMIN];
const MANAGE_PERMISSIONS = [Permission.MANAGE_USERS, Permission.ADMIN];
const READ_ROLES_PERMISSIONS = [Permission.READ_ROLES, Permission.MANAGE_ROLES, Permission.ADMIN];

const INITIAL_FILTERS: IUsersFilters = { roleIds: [], profiles: [], };

const UsersSection = () => {
  const { hasAny, isReady, } = usePermissions();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<IUsersFilters>(INITIAL_FILTERS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!isReady) {
    return <Loading />;
  }

  if (!hasAny(READ_PERMISSIONS)) {
    return (
      <p className={styles.empty}>
        You don&apos;t have access to users. Ask an administrator for permissions.
      </p>
    );
  }

  const canReadRoles = hasAny(READ_ROLES_PERMISSIONS);

  return (
    <section className={styles.section}>
      <p className={styles.description}>
        Accounts of the platform: their roles and teacher / student profiles.
      </p>

      <UsersToolbar
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFiltersChange={setFilters}
        canFilterByRoles={canReadRoles}
        canManage={hasAny(MANAGE_PERMISSIONS)}
        onCreate={() => setIsCreateOpen(true)}
      />

      <UserFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        canAssignRoles={canReadRoles}
      />
    </section>
  );
}

export default UsersSection;
