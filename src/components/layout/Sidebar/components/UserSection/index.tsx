'use client';

import { useEffect } from 'react';
import SidebarUserProfile from '../SidebarUserProfile';
import LoginButton from '../LoginButton';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useAuthSelector, } from '@/hooks/redux/auth';
import { initAuth } from '@/store/slices/authSlice';

const UserSection = () => {
  const authState = useAppSelector(useAuthSelector);
  const dispatch = useAppDispatch();

  useEffect(
    () => {
      dispatch(initAuth());
    }, []
  );

  if (authState.status === 'guest' || authState.status === 'loading')
    return <LoginButton />;

  if (authState.status === 'processing') return <>Loading user...</>;
  // add optimistic user profile
  return <SidebarUserProfile />;
}

export default UserSection;
