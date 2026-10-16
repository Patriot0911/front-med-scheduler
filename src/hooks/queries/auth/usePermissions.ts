import { useCallback } from 'react';
import { Permission } from '@/interfaces/auth/permission';
import useMeQuery from './useMeQuery';

/** `hasAny(perms)` is true when the current user has at least one of the given permissions. */
const usePermissions = () => {
  const { data: meData, isLoading, } = useMeQuery();
  const permissions = meData?.permissions;

  const hasAny = useCallback(
    (required: Permission[]) => !!permissions && required.some((permission) => permissions.includes(permission)),
    [permissions],
  );

  return { hasAny, isLoading, isReady: !!permissions, };
};

export default usePermissions;
