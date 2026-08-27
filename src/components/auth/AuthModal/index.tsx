import { useEffect, useRef } from 'react';
import type { ILogInModalProps } from '@/interfaces/auth/modal';
import { useForm } from 'react-hook-form';
import { LoadingStateVariantsMap, mutationToLoadingState } from '@/lib/loading-mappers';
import useLoginMutation from '@/hooks/mutations/auth/useLoginMutation';
import { AuthLoginButtonDictionary } from '@/configs/auth.dictionary';
import Modal from '@/components/ui/Modal';
import FormInput from '@/components/ui/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, TLoginForm } from './auth.scheme';
import Button from '@/components/ui/Button';

import styles from './styles.module.scss'

const AuthModal = (props: ILogInModalProps) => {
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loginMutation = useLoginMutation();
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

  useEffect(() => {
    if (!props.isOpen) {
      loginMutation.reset();
      methods.reset();
    }
  }, [props.isOpen]);

  useEffect(() => {
    if (!props.isOpen) return;
    if (!loginMutation.isSuccess) return;

    fadeTimer.current = setTimeout(() => {
      props.onClose();
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
          title={'Sign In'}
        />
        <Modal.Content>
          <FormInput<TLoginForm>
            name={'email'}
            label='Email'
            placeholder={'Enter your corporate email'}
            required
            autoComplete='email'
            disabled={loginMutation.isPending || loginMutation.isSuccess}
          />
          <FormInput<TLoginForm>
            name={'password'}
            label='Password'
            type='password'
            placeholder={'Enter password provided by manager'}
            required
            autoComplete='password'
            disabled={loginMutation.isPending || loginMutation.isSuccess}
          />
          <p className={styles['auth-description']}>
            Log in to your account using the credentials provided to you by the manager.
          </p>
        </Modal.Content>
        <Modal.Footer>
          <Button
            type='submit'
            className='flex-1'
            disabled={!methods.formState.isValid || loginMutation.isPending || loginMutation.isSuccess}
            variant={LoadingStateVariantsMap[mutationToLoadingState(loginMutation)]}
          >
            {AuthLoginButtonDictionary[mutationToLoadingState(loginMutation)]}
          </Button>
        </Modal.Footer>
      </Modal.FormBody>
    </Modal>
  );
}

export default AuthModal;
