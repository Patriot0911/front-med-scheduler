import { useAppDispatch } from '@/hooks/redux';
import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import AuthAccounts from '@/lib/auth-accounts';
import { initAuth } from '@/store/slices/authSlice';
import { PropsWithChildren, useEffect, useRef } from 'react';

const AuthProvider = ({ children, }: PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const done = useRef(false);
  const { data: me, } = useMeQuery();

  useEffect(() => {
    if (done.current) {
      return;
    }
    done.current = true;
    dispatch(initAuth());
  }, [dispatch]);

  // the active account is shared by all tabs: when another tab switches it, signs it out or in, this one reloads
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (!AuthAccounts.isStorageKey(event.key)) return;
      const activeId = AuthAccounts.getActive()?.id;
      AuthAccounts.sync();
      if (AuthAccounts.getActive()?.id !== activeId) window.location.reload();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (me) AuthAccounts.updateProfile(me);
  }, [me]);

  return <>{children}</>;
}

export default AuthProvider;
