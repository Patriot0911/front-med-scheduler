'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IProfileTabProps } from '@/interfaces/auth/profile';
import useChangePasswordMutation from '@/hooks/mutations/auth/useChangePasswordMutation';
import Modal from '@/components/ui/Modal';
import FormPasswordInput from '@/components/ui/FormPasswordInput';
import Button from '@/components/ui/Button';
import { changePasswordSchema, TChangePasswordForm } from '../profile.scheme';

import styles from '../styles.module.scss';

const DEFAULT_VALUES: TChangePasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const PasswordTab = ({ onDirtyChange, onCancel, footerStart, }: IProfileTabProps) => {
  const methods = useForm<TChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
    defaultValues: DEFAULT_VALUES,
  });
  const { isDirty, } = methods.formState;
  const mutation = useChangePasswordMutation(() => methods.reset(DEFAULT_VALUES));

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  return (
    <Modal.FormBody
      methods={methods}
      onSubmit={methods.handleSubmit(({ currentPassword, newPassword, }) => (
        mutation.mutate({ currentPassword, newPassword, })
      ))}
    >
      <Modal.Content>
        <p className={styles.description}>Use a password you do not use anywhere else.</p>
        <FormPasswordInput<TChangePasswordForm>
          name={'currentPassword'}
          label={'Current password'}
          autoComplete={'current-password'}
          disabled={mutation.isPending}
          required
        />
        <div className={styles.divider}>
          <span>Set a new password</span>
        </div>
        <div className={styles.fields}>
          <FormPasswordInput<TChangePasswordForm>
            name={'newPassword'}
            label={'New password'}
            autoComplete={'new-password'}
            hint={'Min 8 chars'}
            disabled={mutation.isPending}
            required
          />
          <FormPasswordInput<TChangePasswordForm>
            name={'confirmPassword'}
            label={'Repeat new password'}
            autoComplete={'new-password'}
            disabled={mutation.isPending}
            required
          />
        </div>
      </Modal.Content>
      <Modal.Footer>
        {footerStart}
        <Button variant={'secondary'} disabled={mutation.isPending} onClick={onCancel}>
          Cancel
        </Button>
        <Button type={'submit'} disabled={mutation.isPending || !isDirty} isLoading={mutation.isPending}>
          Change password
        </Button>
      </Modal.Footer>
    </Modal.FormBody>
  );
}

export default PasswordTab;
