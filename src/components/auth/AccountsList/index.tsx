'use client';

import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
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

const getName = (account: IStoredAccount, t: TFunction<'auth'>) => account.fullName || account.email || t('accounts.unknown');

const getLogoutDescription = (account: IStoredAccount, isActive: boolean, t: TFunction<'auth'>) => {
  const name = getName(account, t);
  if (!AuthAccounts.isUsable(account)) return t('accounts.confirmRemove', { name, });
  if (!isActive) return t('accounts.confirmLogOutInactive', { name, });
  return AuthAccounts.getNextUsable(account.id)
    ? t('accounts.confirmLogOutSwitch', { name, })
    : t('accounts.confirmLogOut', { name, });
};

const AccountsList = ({ onSelect, disabled, }: IAccountsListProps) => {
  const { t, } = useTranslation('auth');
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
          const name = getName(account, t);

          return (
            <li key={account.id} className={cn(styles.account, isActive && styles['account--active'])}>
              <Avatar name={name} />
              <div className={styles.info}>
                <span className={styles.name}>{name}</span>
                <span className={styles.email}>{account.email}</span>
              </div>
              {isActive && <span className={styles.badge}>{t('accounts.current')}</span>}
              {!isSignedIn && <span className={cn(styles.badge, styles['badge--muted'])}>{t('accounts.signedOut')}</span>}
              <div className={styles.actions}>
                {!isActive && (
                  <Button variant={'secondary'} disabled={isDisabled} onClick={() => onSelect(account)}>
                    {isSignedIn ? t('accounts.switch') : t('accounts.signIn')}
                  </Button>
                )}
                <Button
                  variant={'ghost'}
                  className={styles.remove}
                  leftIcon={isSignedIn ? <LuLogOut /> : <LuX />}
                  aria-label={isSignedIn ? t('accounts.logOutOf', { name, }) : t('accounts.removeName', { name, })}
                  title={isSignedIn ? t('accounts.logOut') : t('accounts.remove')}
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
          ? getLogoutDescription(logoutTarget.account, logoutTarget.account.id === activeId, t)
          : undefined}
      />
    </>
  );
}

export default AccountsList;
