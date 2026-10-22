'use client';

import useRolesDictionaryQuery from '@/hooks/queries/dictionaries/useRolesDictionaryQuery';
import ChipsCell from '@/components/dictionaries/cells/ChipsCell';

interface IUserRolesCellProps {
  roleIds: string[];
  /** The roles dictionary needs its own permission; without it only the count is shown */
  canReadRoles: boolean;
};

/** Role ids → role names (from the cached /dictionaries/roles list). */
const UserRolesCell = ({ roleIds, canReadRoles, }: IUserRolesCellProps) => {
  const { data: roles, } = useRolesDictionaryQuery(canReadRoles && roleIds.length > 0);

  if (!canReadRoles) {
    return <>{roleIds.length || '—'}</>;
  }

  const namesById = new Map((roles ?? []).map((role) => [role.id, role.name]));

  return <ChipsCell items={roleIds.map((id) => namesById.get(id) ?? '…')} limit={2} emptyText={'No roles'} />;
}

export default UserRolesCell;
