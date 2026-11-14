'use client';

import { useState } from 'react';
import { LuLogOut, LuX } from 'react-icons/lu';
import type { IAccountsListProps, IStoredAccount } from '@/interfaces/auth/accounts';
import { mutationToLoadingState } from '@/lib/loading-mappers';
import AuthAccounts from '@/lib/auth-accounts';
import { cn } from '@/lib/cn';
import useAuthAccounts from '@/hooks/auth/useAuthAccounts';
import useLogoutMutation from '@/hooks/mutations/auth/useLogoutMutation';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/modals/ConfirmModal';

import styles from './styles.module.scss';

const getName = (account: IStoredAccount) => account.fullName || account.email || 'Unknown account';

const getLogoutDescription = (account: IStoredAccount, isActive: boolean) => {
  const name = getName(account);
  if (!AuthAccounts.isUsable(account)) return `Remove ${name} from the accounts saved on this device?`;
  if (!isActive) return `Log out of ${name}? The account will be removed from this device.`;
  return AuthAccounts.getNextUsable(account.id)
    ? `Log out of ${name}? You will be switched to another signed-in account.`
    : `Log out of ${name}?`;
};

const AccountsList = ({ onSelect, disabled, }: IAccountsListProps) => {
  const { accounts, activeId, } = useAuthAccounts();
  const [logoutTarget, setLogoutTarget] = useState<{ isOpen: boolean, account: IStoredAccount | null }>({
    isOpen: false,
    account: null,
  });
  const logoutMutation = useLogoutMutation();
  const isDisabled = disabled || logoutMutation.isPending;

  const askLogout = (account: IStoredAccount) => {
    logoutMutation.reset();
    setLogoutTarget({ isOpen: true, account, });
  };
  const closeLogout = () => setLogoutTarget((prev) => ({ ...prev, isOpen: false, }));

  return (
    <>
      <ul className={styles.list}>
        {accounts.map((account) => {
          const isActive = account.id === activeId;
          const isSignedIn = AuthAccounts.isUsable(account);
          const name = getName(account);

          return (
            <li key={account.id} className={cn(styles.account, isActive && styles['account--active'])}>
              <Avatar name={name} />
              <div className={styles.info}>
                <span className={styles.name}>{name}</span>
                <span className={styles.email}>{account.email}</span>
              </div>
              {isActive && <span className={styles.badge}>Current</span>}
              {!isSignedIn && <span className={cn(styles.badge, styles['badge--muted'])}>Signed out</span>}
              <div className={styles.actions}>
                {!isActive && (
                  <Button variant={'secondary'} disabled={isDisabled} onClick={() => onSelect(account)}>
                    {isSignedIn ? 'Switch' : 'Sign in'}
                  </Button>
                )}
                <Button
                  variant={'ghost'}
                  className={styles.remove}
                  leftIcon={isSignedIn ? <LuLogOut /> : <LuX />}
                  aria-label={isSignedIn ? `Log out of ${name}` : `Remove ${name}`}
                  title={isSignedIn ? 'Log out' : 'Remove'}
                  disabled={isDisabled}
                  onClick={() => askLogout(account)}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <ConfirmModal
        isOpen={logoutTarget.isOpen}
        onClose={closeLogout}
        onConfirm={() => {
          if (logoutTarget.account) logoutMutation.mutate(logoutTarget.account.id, { onSuccess: closeLogout, });
        }}
        requestState={mutationToLoadingState(logoutMutation)}
        description={logoutTarget.account
          ? getLogoutDescription(logoutTarget.account, logoutTarget.account.id === activeId)
          : undefined}
      />
    </>
  );
}

export default AccountsList;
