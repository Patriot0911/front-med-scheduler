'use client';

import { useState } from 'react';
import { LuLogOut, LuUserPlus } from 'react-icons/lu';
import type { IAccountsTabProps } from '@/interfaces/auth/profile';
import type { IStoredAccount } from '@/interfaces/auth/accounts';
import { mutationToLoadingState } from '@/lib/loading-mappers';
import AuthAccounts, { MAX_ACCOUNTS } from '@/lib/auth-accounts';
import useAuthAccounts from '@/hooks/auth/useAuthAccounts';
import useLogoutAllMutation from '@/hooks/mutations/auth/useLogoutAllMutation';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/modals/ConfirmModal';
import AuthModal from '@/components/auth/AuthModal';
import AccountsList from '@/components/auth/AccountsList';

import styles from '../styles.module.scss';

const AccountsTab = ({ onCancel, confirmLeave, }: IAccountsTabProps) => {
  const { accounts, } = useAuthAccounts();
  const [signIn, setSignIn] = useState<{ isOpen: boolean, email?: string }>({ isOpen: false, });
  const [isLogoutAllOpen, setIsLogoutAllOpen] = useState(false);
  const logoutAllMutation = useLogoutAllMutation();
  const isFull = accounts.length >= MAX_ACCOUNTS;

  const selectAccount = (account: IStoredAccount) => confirmLeave(() => {
    if (!AuthAccounts.switchTo(account.id)) setSignIn({ isOpen: true, email: account.email, });
  });

  return (
    <div className={styles.panel}>
      <Modal.Content>
        <p className={styles.description}>
          Accounts signed in on this device. An account left unused for a week is signed out and asks for its password again.
        </p>
        <AccountsList onSelect={selectAccount} />
      </Modal.Content>
      <Modal.Footer>
        <Button
          variant={'ghost'}
          leftIcon={<LuLogOut />}
          className={styles.logout}
          aria-label={'Log out of all accounts'}
          onClick={() => {
            logoutAllMutation.reset();
            setIsLogoutAllOpen(true);
          }}
        >
          <span className={styles['logout-label']}>Log out of all</span>
        </Button>
        <Button variant={'secondary'} onClick={onCancel}>
          Close
        </Button>
        <Button
          leftIcon={<LuUserPlus />}
          disabled={isFull}
          title={isFull ? `Up to ${MAX_ACCOUNTS} accounts; remove one to add another` : undefined}
          onClick={() => confirmLeave(() => setSignIn({ isOpen: true, }))}
        >
          Add account
        </Button>
      </Modal.Footer>

      <AuthModal
        mode={'add-account'}
        isOpen={signIn.isOpen}
        defaultEmail={signIn.email}
        onClose={() => setSignIn((prev) => ({ ...prev, isOpen: false, }))}
        onAuthenticated={(user) => AuthAccounts.switchTo(user.id)}
      />
      <ConfirmModal
        isOpen={isLogoutAllOpen}
        onClose={() => setIsLogoutAllOpen(false)}
        onConfirm={() => logoutAllMutation.mutate()}
        requestState={mutationToLoadingState(logoutAllMutation)}
        description={'Log out of every account and remove them all from this device?'}
      />
    </div>
  );
}

export default AccountsTab;
