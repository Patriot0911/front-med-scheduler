'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IProfileFormProps } from '@/interfaces/auth/profile';
import useChangePasswordMutation from '@/hooks/mutations/auth/useChangePasswordMutation';
import Modal from '@/components/ui/Modal';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import ProfileSection from '../ProfileSection';
import { changePasswordSchema, TChangePasswordForm } from '../profile.scheme';

const DEFAULT_VALUES: TChangePasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

/** Password change of the current user; the current password is checked by the API. */
const ChangePasswordForm = ({ className, }: IProfileFormProps) => {
  const methods = useForm<TChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
    defaultValues: DEFAULT_VALUES,
  });
  const mutation = useChangePasswordMutation(() => methods.reset(DEFAULT_VALUES));

  return (
    <Modal.FormBody
      className={className}
      methods={methods}
      onSubmit={methods.handleSubmit(({ currentPassword, newPassword, }) => (
        mutation.mutate({ currentPassword, newPassword, })
      ))}
    >
      <ProfileSection
        title={'Password'}
        description={'Confirm the change with your current password.'}
        action={(
          <Button
            type={'submit'}
            disabled={mutation.isPending || !methods.formState.isDirty}
            isLoading={mutation.isPending}
          >
            Change password
          </Button>
        )}
      >
        <FormInput<TChangePasswordForm>
          name={'currentPassword'}
          label={'Current password'}
          type={'password'}
          autoComplete={'current-password'}
          required
        />
        <FormInput<TChangePasswordForm>
          name={'newPassword'}
          label={'New password'}
          type={'password'}
          autoComplete={'new-password'}
          hint={'Min 8 chars'}
          required
        />
        <FormInput<TChangePasswordForm>
          name={'confirmPassword'}
          label={'Repeat new password'}
          type={'password'}
          autoComplete={'new-password'}
          required
        />
      </ProfileSection>
    </Modal.FormBody>
  );
}

export default ChangePasswordForm;
