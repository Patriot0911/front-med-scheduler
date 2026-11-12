'use client';

import dayjs from 'dayjs';
import { LuPencil } from 'react-icons/lu';
import Table from '@/components/ui/Table';
import { Permission } from '@/interfaces/auth/permission';
import { ITableAction, ITableColumn } from '@/interfaces/ui/table';
import { IUser, IUsersTableProps } from '@/interfaces/users/users';
import usePermissions from '@/hooks/queries/auth/usePermissions';
import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import useUsersTableQuery from '@/hooks/queries/users/useUsersTableQuery';
import UserNameCell from '../cells/UserNameCell';
import UserRolesCell from '../cells/UserRolesCell';
import UserProfilesCell from '../cells/UserProfilesCell';
import UserDepartmentCell from '../cells/UserDepartmentCell';
import UserGroupCell from '../cells/UserGroupCell';

import emptyStyles from '../cells/styles/empty.module.scss';

export const USERS_PAGE_SIZE = 10;
const DATE_FORMAT = 'DD.MM.YYYY';
const READ_ROLES_PERMISSIONS = [Permission.READ_ROLES, Permission.MANAGE_ROLES, Permission.ADMIN];

const UsersTable = ({ page, search, filters, canManage, onPageChange, onEdit, }: IUsersTableProps) => {
  const { hasAny, } = usePermissions();
  const { data: me, } = useMeQuery();
  const canReadRoles = hasAny(READ_ROLES_PERMISSIONS);
  const { data, isLoading, isFetching, } = useUsersTableQuery(page, USERS_PAGE_SIZE, search, filters);
  const total = data?.meta.count ?? 0;
  const hasFilters = !!search || filters.roleIds.length > 0 || filters.profiles.length > 0;

  const columns: ITableColumn<IUser>[] = [
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
      width: '10rem',
      render: (user) => <UserProfilesCell user={user} />,
    },
    {
      key: 'department',
      title: 'Department',
      width: '12rem',
      render: (user) => <UserDepartmentCell teacher={user.teacher} />,
    },
    {
      key: 'studentGroup',
      title: 'Student group',
      width: '10rem',
      render: (user) => <UserGroupCell student={user.student} />,
    },
    {
      key: 'lastLoginAt',
      title: 'Last login',
      width: '7rem',
      render: (user) => user.lastLoginAt
        ? dayjs(user.lastLoginAt).format(DATE_FORMAT)
        : <span className={emptyStyles.empty}>Never</span>,
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
      rowLock={canManage ? {
        isLocked: (user) => !user.canManage,
        reason: (user) => user.id === me?.id
          ? 'This is your account: edit it in your profile'
          : 'This user ranks at or above you',
      } : undefined}
      pageSize={USERS_PAGE_SIZE}
      rowSize={'lg'}
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
