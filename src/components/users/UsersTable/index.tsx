'use client';

import dayjs from 'dayjs';
import { LuPencil } from 'react-icons/lu';
import Table from '@/components/ui/Table';
import { Permission } from '@/interfaces/auth/permission';
import { ITableAction, ITableColumn } from '@/interfaces/ui/table';
import { IUser, IUsersTableProps } from '@/interfaces/users/users';
import usePermissions from '@/hooks/queries/auth/usePermissions';
import useUsersTableQuery from '@/hooks/queries/users/useUsersTableQuery';
import UserNameCell from '../cells/UserNameCell';
import UserRolesCell from '../cells/UserRolesCell';
import UserProfilesCell from '../cells/UserProfilesCell';

export const USERS_PAGE_SIZE = 10;
const DATE_FORMAT = 'DD.MM.YYYY';
const READ_ROLES_PERMISSIONS = [Permission.READ_ROLES, Permission.MANAGE_ROLES, Permission.ADMIN];

const UsersTable = ({ page, search, filters, canManage, onPageChange, onEdit, }: IUsersTableProps) => {
  const { hasAny, } = usePermissions();
  const canReadRoles = hasAny(READ_ROLES_PERMISSIONS);
  const { data, isLoading, isFetching, } = useUsersTableQuery(page, USERS_PAGE_SIZE, search, filters);
  const total = data?.meta.count ?? 0;
  const hasFilters = !!search || filters.roleIds.length > 0 || filters.profiles.length > 0;

  const columns: ITableColumn<IUser>[] = [
    // fixed widths keep the columns readable on narrow screens, where the table scrolls instead;
    // the user column has no width, so it takes the rest of the space
    {
      key: 'name',
      title: 'User',
      render: (user) => <UserNameCell user={user} />,
    },
    {
      key: 'roles',
      title: 'Roles',
      width: '12rem',
      render: (user) => <UserRolesCell roleIds={user.roleIds} canReadRoles={canReadRoles} />,
    },
    {
      key: 'profiles',
      title: 'Profiles',
      width: '15rem',
      render: (user) => <UserProfilesCell user={user} />,
    },
    {
      key: 'lastLoginAt',
      title: 'Last login',
      width: '7rem',
      render: (user) => user.lastLoginAt
        ? dayjs(user.lastLoginAt).format(DATE_FORMAT)
        : <span style={{ color: 'var(--color-text-muted)' }}>Never</span>,
    },
  ];

  const actions: ITableAction<IUser>[] | undefined = canManage
    ? [
      {
        key: 'edit',
        icon: <LuPencil />,
        label: 'Edit user',
        onClick: onEdit,
      },
    ]
    : undefined;

  return (
    <Table<IUser>
      columns={columns}
      actions={actions}
      rowKey={(user) => user.id}
      data={data?.items ?? []}
      skeletonRows={5}
      isLoading={isLoading}
      emptyText={hasFilters ? 'No users match the filters' : 'No users yet'}
      onRowClick={canManage ? onEdit : undefined}
      pageSize={USERS_PAGE_SIZE}
      pagination={{
        page,
        total,
        onChange: onPageChange,
        disabled: isFetching,
      }}
    >
      <Table.Header />
      <Table.Body />
    </Table>
  );
}

export default UsersTable;
