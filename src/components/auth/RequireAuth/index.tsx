'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux';
import { authStatusSelector } from '@/hooks/redux/auth';
import Loading from '@/components/ui/Loading';

import { IRequireAuthProps } from '@/interfaces/auth/auth-guard';

const RequireAuth = ({ children, fallback, redirectPath, shouldRedirect = false }: IRequireAuthProps) => {
  const status = useAppSelector(authStatusSelector);
  const router = useRouter();
  const redirectTo = redirectPath || '/login';

  useEffect(() => {
    if (status === 'guest' && shouldRedirect) {
      router.replace(redirectTo);
    }
  }, [status, router, shouldRedirect, redirectPath]);

  if (status === 'init') {
    return <Loading />;
  }

  if (status === 'guest') {
    return fallback || <></>;
  }

  return <>{children}</>;
}

export default RequireAuth;
