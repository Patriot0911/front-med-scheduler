import { useMemo } from 'react';
import { SIDEBAR_GROUPS } from '@/configs/sidebar.config';
import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import usePermissions from '@/hooks/queries/auth/usePermissions';
import type { INavAccess } from '@/interfaces/layout/sidebar';

/** Sidebar groups with only the items visible to the current user; empty groups are dropped */
const useNavbarGroups = () => {
  const { data: user, } = useMeQuery();
  const { hasAny, } = usePermissions();

  return useMemo(() => {
    const access: INavAccess = { user: user ?? null, hasAny, };
    return SIDEBAR_GROUPS
      .map((group) => ({ ...group, items: group.items.filter((item) => !item.isVisible || item.isVisible(access)), }))
      .filter((group) => group.items.length > 0);
  }, [user, hasAny]);
};

export default useNavbarGroups;
