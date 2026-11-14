import { useEffect, useRef } from 'react';
import type { ILogInModalProps } from '@/interfaces/auth/modal';
import { useForm } from 'react-hook-form';
import { LoadingStateVariantsMap, mutationToLoadingState } from '@/lib/loading-mappers';
import useLoginMutation from '@/hooks/mutations/auth/useLoginMutation';
import { AuthAddAccountButtonDictionary, AuthLoginButtonDictionary } from '@/configs/auth.dictionary';
import type { IStoredAccount } from '@/interfaces/auth/accounts';
import AuthAccounts from '@/lib/auth-accounts';
import useAuthAccounts from '@/hooks/auth/useAuthAccounts';
import AccountsList from '@/components/auth/AccountsList';
import Modal from '@/components/ui/Modal';
import FormInput from '@/components/ui/FormInput';
import FormPasswordInput from '@/components/ui/FormPasswordInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, TLoginForm } from './auth.scheme';
import Button from '@/components/ui/Button';

import styles from './styles.module.scss'

const AuthModal = ({ onAuthenticated, mode = 'sign-in', defaultEmail, ...props }: ILogInModalProps) => {
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAddingAccount = mode === 'add-account';
  const loginMutation = useLoginMutation(isAddingAccount);
  const { accounts, } = useAuthAccounts();
  const buttonDictionary = isAddingAccount ? AuthAddAccountButtonDictionary : AuthLoginButtonDictionary;
  const methods = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const loginHandler = (data: TLoginForm) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  // a saved account of a guest: a live one is switched to, a signed-out one prefills the form
  const selectSavedAccount = (account: IStoredAccount) => {
    if (AuthAccounts.switchTo(account.id)) return;
    methods.setValue('email', account.email, { shouldValidate: true, });
    methods.setFocus('password');
  };

  useEffect(() => {
    if (!props.isOpen) {
      loginMutation.reset();
      methods.reset();
    } else if (defaultEmail) {
      methods.reset({ email: defaultEmail, password: '', });
    }
  }, [props.isOpen]);

  useEffect(() => {
    if (!props.isOpen) return;
    if (!loginMutation.isSuccess) return;

    fadeTimer.current = setTimeout(() => {
      props.onClose();
      if (loginMutation.data) onAuthenticated?.(loginMutation.data.user);
    }, 1500);

    return () => {
      if (fadeTimer.current) {
        clearTimeout(fadeTimer.current);
        fadeTimer.current = null;
      }
    };
  }, [loginMutation.isSuccess, props.isOpen]);

  return (
    <Modal {...props} isLoading={loginMutation.isPending}>
      <Modal.FormBody methods={methods} onSubmit={methods.handleSubmit(loginHandler)}>
        <Modal.Header
          title={isAddingAccount ? 'Add account' : 'Sign In'}
        />
        <Modal.Content>
          {!isAddingAccount && accounts.length > 0 && (
            <div className={styles['saved-accounts']}>
              <span className={styles['saved-accounts-title']}>Saved accounts</span>
              <AccountsList onSelect={selectSavedAccount} disabled={loginMutation.isPending || loginMutation.isSuccess} />
            </div>
          )}
          <FormInput<TLoginForm>
            name={'email'}
            label='Email'
            placeholder={'Enter your corporate email'}
            required
            autoComplete='email'
            disabled={loginMutation.isPending || loginMutation.isSuccess}
          />
          <FormPasswordInput<TLoginForm>
            name={'password'}
            label='Password'
            placeholder={'Enter password provided by manager'}
            required
            autoComplete='current-password'
            disabled={loginMutation.isPending || loginMutation.isSuccess}
          />
          <p className={styles['auth-description']}>
            {isAddingAccount
              ? 'Sign in to another account. It is saved on this device next to the current one, and you switch to it right away.'
              : 'Log in to your account using the credentials provided to you by the manager.'}
          </p>
        </Modal.Content>
        <Modal.Footer>
          <Button
            type='submit'
            className='flex-1'
            disabled={!methods.formState.isValid || loginMutation.isPending || loginMutation.isSuccess}
            variant={LoadingStateVariantsMap[mutationToLoadingState(loginMutation)]}
          >
            {buttonDictionary[mutationToLoadingState(loginMutation)]}
          </Button>
        </Modal.Footer>
      </Modal.FormBody>
    </Modal>
  );
}

export default AuthModal;
