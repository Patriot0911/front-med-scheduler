'use client';

import { useAppDispatch } from '@/hooks/redux';
import { initAuth } from '@/store/slices/authSlice';
import { useEffect } from 'react';

const AuthInit = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initAuth());
  }, []);

  return null;
}

export default AuthInit;
