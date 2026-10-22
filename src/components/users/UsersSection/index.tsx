'use client';

import { useState } from 'react';
import { Permission } from '@/interfaces/auth/permission';
import { IUser, IUsersFilters } from '@/interfaces/users/users';
import usePermissions from '@/hooks/queries/auth/usePermissions';
import useDebouncedValue from '@/hooks/shared/useDebouncedValue';
import Loading from '@/components/ui/Loading';
import UsersToolbar from '../UsersToolbar';
import UsersTable from '../UsersTable';
import UserFormModal from '../forms/UserFormModal';

import styles from './styles.module.scss';

const READ_PERMISSIONS = [Permission.READ_USERS, Permission.MANAGE_USERS, Permission.ADMIN];
const MANAGE_PERMISSIONS = [Permission.MANAGE_USERS, Permission.ADMIN];
const READ_ROLES_PERMISSIONS = [Permission.READ_ROLES, Permission.MANAGE_ROLES, Permission.ADMIN];

const INITIAL_FILTERS: IUsersFilters = { roleIds: [], profiles: [], };

type TFormState = { isOpen: boolean; item: IUser | null };

const UsersSection = () => {
  const { hasAny, isReady, } = usePermissions();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim());
  const [filters, setFilters] = useState<IUsersFilters>(INITIAL_FILTERS);
  // the item is kept after closing so the modal keeps its content during the exit animation
  const [form, setForm] = useState<TFormState>({ isOpen: false, item: null, });

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
  const canManage = hasAny(MANAGE_PERMISSIONS);

  return (
    <section className={styles.section}>
      <p className={styles.description}>
        Accounts of the platform: their roles and teacher / student profiles.
      </p>

      <UsersToolbar
        search={search}
        onSearchChange={(next) => {
          setSearch(next);
          setPage(1);
        }}
        filters={filters}
        onFiltersApply={(next) => {
          setFilters(next);
          setPage(1);
        }}
        canFilterByRoles={canReadRoles}
        canManage={canManage}
        onCreate={() => setForm({ isOpen: true, item: null, })}
      />

      <UsersTable
        page={page}
        search={debouncedSearch}
        filters={filters}
        canManage={canManage}
        onPageChange={setPage}
        onEdit={(item) => setForm({ isOpen: true, item, })}
      />

      <UserFormModal
        isOpen={form.isOpen}
        item={form.item}
        onClose={() => setForm((prev) => ({ ...prev, isOpen: false, }))}
        canAssignRoles={canReadRoles}
      />
    </section>
  );
}

export default UsersSection;
