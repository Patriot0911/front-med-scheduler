'use client';

import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LuKeyRound } from 'react-icons/lu';
import { IProfileSectionFormProps } from '@/interfaces/auth/profile';
import useChangePasswordMutation from '@/hooks/mutations/auth/useChangePasswordMutation';
import FormPasswordInput from '@/components/ui/FormPasswordInput';
import Button from '@/components/ui/Button';
import Collapse from '@/components/ui/Collapse';
import ProfileSection from '../ProfileSection';
import { changePasswordSchema, TChangePasswordForm } from '../profile.scheme';

import styles from '../styles.module.scss';

const DEFAULT_VALUES: TChangePasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

/** Collapsed by default: a password change is rare, its form opens on demand. */
const PasswordSection = ({ onDirtyChange, }: IProfileSectionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const methods = useForm<TChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
    defaultValues: DEFAULT_VALUES,
  });
  const { isDirty, } = methods.formState;
  const mutation = useChangePasswordMutation(() => setIsEditing(false));

  useEffect(() => {
    onDirtyChange(isEditing && isDirty);
  }, [isEditing, isDirty, onDirtyChange]);

  const startEditing = () => {
    methods.reset(DEFAULT_VALUES);
    mutation.reset();
    setIsEditing(true);
  };

  return (
    <ProfileSection
      title={'Password'}
      description={'Use a password you do not use anywhere else.'}
      headerAction={!isEditing && (
        <Button variant={'ghost'} leftIcon={<LuKeyRound />} className={styles['section-action']} onClick={startEditing}>
          Change password
        </Button>
      )}
    >
      <Collapse isOpen={isEditing} className={styles['section-form']}>
        <FormProvider {...methods}>
          <form
            className={styles.fields}
            onSubmit={methods.handleSubmit(({ currentPassword, newPassword, }) => (
              mutation.mutate({ currentPassword, newPassword, })
            ))}
          >
            <FormPasswordInput<TChangePasswordForm>
              name={'currentPassword'}
              label={'Current password'}
              autoComplete={'current-password'}
              required
            />
            <FormPasswordInput<TChangePasswordForm>
              name={'newPassword'}
              label={'New password'}
              autoComplete={'new-password'}
              hint={'Min 8 chars'}
              required
            />
            <FormPasswordInput<TChangePasswordForm>
              name={'confirmPassword'}
              label={'Repeat new password'}
              autoComplete={'new-password'}
              required
            />
            <div className={styles['form-actions']}>
              <Button variant={'secondary'} disabled={mutation.isPending} onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type={'submit'} disabled={mutation.isPending || !isDirty} isLoading={mutation.isPending}>
                Change password
              </Button>
            </div>
          </form>
        </FormProvider>
      </Collapse>
    </ProfileSection>
  );
}

export default PasswordSection;
