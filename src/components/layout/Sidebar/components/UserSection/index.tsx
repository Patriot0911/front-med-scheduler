'use client';

import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import SidebarUserProfile from '../SidebarUserProfile';
import LoginButton from '../LoginButton';
import { useAppSelector } from '@/hooks/redux';
import { authStatusSelector } from '@/hooks/redux/auth';

const UserSection = () => {
  const status = useAppSelector(authStatusSelector);
  const { isLoading, isEnabled, } = useMeQuery();

  if (!isEnabled && status === 'guest')
    return <LoginButton />;

  // todo: show skeleton
  if (isLoading || status === 'init') return <>Loading user...</>;

  return <SidebarUserProfile />;
}

export default UserSection;
