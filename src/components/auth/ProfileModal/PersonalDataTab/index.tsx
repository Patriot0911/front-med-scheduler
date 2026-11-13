'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IAuthMeResponse } from '@/interfaces/auth/me';
import { IProfileTabProps } from '@/interfaces/auth/profile';
import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import useEditMeMutation from '@/hooks/mutations/auth/useEditMeMutation';
import Modal from '@/components/ui/Modal';
import FormInput from '@/components/ui/FormInput';
import FormPasswordInput from '@/components/ui/FormPasswordInput';
import Button from '@/components/ui/Button';
import Collapse from '@/components/ui/Collapse';
import { profileDataSchema, TProfileDataForm } from '../profile.scheme';

import styles from '../styles.module.scss';

const toFormValues = (me?: IAuthMeResponse): TProfileDataForm => ({
  fullName: me?.fullName ?? '',
  email: me?.email ?? '',
  currentPassword: '',
});

const PersonalDataTab = ({ onDirtyChange, onCancel, footerStart, }: IProfileTabProps) => {
  const { data: me, } = useMeQuery();
  const methods = useForm<TProfileDataForm>({
    resolver: zodResolver(profileDataSchema),
    mode: 'onTouched',
    defaultValues: toFormValues(me),
  });
  const { isDirty, } = methods.formState;
  const email = useWatch({ control: methods.control, name: 'email', });
  const isEmailChanged = email !== me?.email;
  const mutation = useEditMeMutation((data) => methods.reset(toFormValues(data)));

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const submit = methods.handleSubmit(({ fullName, email, currentPassword, }) => {
    // the email is the login, so the API asks to confirm its change with the password
    if (isEmailChanged && !currentPassword) {
      methods.setError('currentPassword', { message: 'Required to change the email', });
      return;
    }
    mutation.mutate({
      fullName: fullName.trim(),
      email,
      ...(isEmailChanged ? { currentPassword, } : {}),
    });
  });

  return (
    <Modal.FormBody methods={methods} onSubmit={submit}>
      <Modal.Content>
        <div className={styles.fields}>
          <FormInput<TProfileDataForm>
            name={'fullName'}
            label={'Full name'}
            hint={'Shown in schedules and lists'}
            autoComplete={'name'}
            disabled={mutation.isPending}
            required
          />
          <FormInput<TProfileDataForm>
            name={'email'}
            label={'Email'}
            hint={'Used to sign in'}
            type={'email'}
            autoComplete={'email'}
            disabled={mutation.isPending}
            required
          />
        </div>
        <Collapse isOpen={isEmailChanged}>
          <FormPasswordInput<TProfileDataForm>
            name={'currentPassword'}
            label={'Current password'}
            hint={'Confirms the new email'}
            autoComplete={'current-password'}
            disabled={mutation.isPending}
            required
          />
        </Collapse>
      </Modal.Content>
      <Modal.Footer>
        {footerStart}
        <Button variant={'secondary'} disabled={mutation.isPending} onClick={onCancel}>
          Cancel
        </Button>
        <Button type={'submit'} disabled={mutation.isPending || !isDirty} isLoading={mutation.isPending}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal.FormBody>
  );
}

export default PersonalDataTab;
