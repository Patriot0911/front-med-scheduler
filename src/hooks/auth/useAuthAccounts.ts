import { useSyncExternalStore } from 'react';
import AuthAccounts from '@/lib/auth-accounts';

const getActiveId = () => AuthAccounts.getActive()?.id ?? null;
const getServerActiveId = () => null;

const useAuthAccounts = () => {
  const accounts = useSyncExternalStore(AuthAccounts.subscribe, AuthAccounts.getAccounts, AuthAccounts.getServerAccounts);
  const activeId = useSyncExternalStore(AuthAccounts.subscribe, getActiveId, getServerActiveId);

  return { accounts, activeId, };
};

export default useAuthAccounts;
