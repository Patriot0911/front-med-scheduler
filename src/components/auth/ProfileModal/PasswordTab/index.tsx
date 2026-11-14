'use client';

import { useTranslation } from 'react-i18next';
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
  const { t, } = useTranslation(['auth', 'common']);
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
        <FormPasswordInput<TChangePasswordForm>
          name={'currentPassword'}
          label={t('profile.password.current')}
          autoComplete={'current-password'}
          disabled={mutation.isPending}
          required
        />
        <div className={styles.divider}>
          <span>{t('profile.password.setNew')}</span>
        </div>
        <div className={styles.fields}>
          <FormPasswordInput<TChangePasswordForm>
            name={'newPassword'}
            label={t('profile.password.new')}
            autoComplete={'new-password'}
            hint={t('profile.password.newHint')}
            disabled={mutation.isPending}
            required
          />
          <FormPasswordInput<TChangePasswordForm>
            name={'confirmPassword'}
            label={t('profile.password.repeat')}
            autoComplete={'new-password'}
            disabled={mutation.isPending}
            required
          />
        </div>
      </Modal.Content>
      <Modal.Footer>
        {footerStart}
        <Button variant={'secondary'} disabled={mutation.isPending} onClick={onCancel}>
          {t('common:actions.cancel')}
        </Button>
        <Button type={'submit'} disabled={mutation.isPending || !isDirty} isLoading={mutation.isPending}>
          {t('profile.password.submit')}
        </Button>
      </Modal.Footer>
    </Modal.FormBody>
  );
}

export default PasswordTab;
