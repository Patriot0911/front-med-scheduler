import { useEffect } from 'react';
import type { ILogInModalProps } from '@/interfaces/auth/modal';
import { FormProvider, useForm } from 'react-hook-form';
import useLoginMutation from '@/hooks/mutations/useLoginMutation';
import Modal from '@/components/ui/Modal';
import FormInput from '@/components/ui/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, TLoginForm } from './auth.scheme';
import Button from '@/components/ui/Button';

import styles from './styles.module.scss'

const AuthModal = (props: ILogInModalProps) => {
  const loginMutation = useLoginMutation();
  const methods = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const loginHandler = (data: TLoginForm) => {
    loginMutation.mutate({ email: data.email, password: data.password, });
  };

  useEffect(
    () => methods.reset(),
    [props.isOpen]
  );

  return (
    <Modal {...props} isLoading={loginMutation.isPending}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(loginHandler)} className={styles['auth-form']}>
          <span className={styles['auth-title']}>Sign In</span>
          <div className={styles['auth-inputs']}>
            <FormInput<TLoginForm>
              name={'email'}
              label='Email'
            />
            <FormInput<TLoginForm>
              name={'password'}
              label='Password'
            />
          </div>
          <p>Log in to your account using the credentials provided to you by the manager.</p>
          <Button type='submit' disabled={!methods.formState.isValid || loginMutation.isPending}>Sign In</Button>
        </form>
      </FormProvider>
    </Modal>
  );
}

export default AuthModal;
