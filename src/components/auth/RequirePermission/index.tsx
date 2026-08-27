'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux';
import { authStatusSelector } from '@/hooks/redux/auth';
import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import Loading from '@/components/ui/Loading';
import { IRequirePermissionProps } from '@/interfaces/auth/auth-guard';

const RequirePermission = ({ children, fallback, permissions, redirectPath, shouldRedirect = false }: IRequirePermissionProps) => {
  const status = useAppSelector(authStatusSelector);
  const { data: meData, } = useMeQuery();
  const router = useRouter();
  const redirectTo = redirectPath || '/login';

  const hasPermission = useMemo(() => {
    if (!meData) return false;
    return permissions.every(permission => meData.permissions.includes(permission));
  }, [meData, permissions]);

  useEffect(() => {
    if (!shouldRedirect) {
      return;
    }
    if (status === 'guest') {
      router.replace(redirectTo);
    }
    if (status === 'authenticated' && meData && !hasPermission) {
      router.replace(redirectTo);
    }
  }, [status, router, meData, permissions, shouldRedirect, redirectPath, hasPermission]);

  if (status === 'init') {
    return <Loading />;
  }

  if (status === 'guest' || (status === 'authenticated' && meData && !hasPermission)) {
    return fallback || <></>;
  }

  return <>{children}</>;
}

export default RequirePermission;
