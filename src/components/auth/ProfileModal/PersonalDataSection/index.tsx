'use client';

import { useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LuPencil } from 'react-icons/lu';
import { IAuthMeResponse } from '@/interfaces/auth/me';
import { IProfileSectionFormProps } from '@/interfaces/auth/profile';
import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import useEditMeMutation from '@/hooks/mutations/auth/useEditMeMutation';
import FormInput from '@/components/ui/FormInput';
import FormPasswordInput from '@/components/ui/FormPasswordInput';
import Button from '@/components/ui/Button';
import Collapse from '@/components/ui/Collapse';
import ProfileSection from '../ProfileSection';
import { profileDataSchema, TProfileDataForm } from '../profile.scheme';

import styles from '../styles.module.scss';

const toFormValues = (me?: IAuthMeResponse): TProfileDataForm => ({
  fullName: me?.fullName ?? '',
  email: me?.email ?? '',
  currentPassword: '',
});

/** Name and email: shown as text, edited after "Edit". */
const PersonalDataSection = ({ onDirtyChange, }: IProfileSectionFormProps) => {
  const { data: me, } = useMeQuery();
  const [isEditing, setIsEditing] = useState(false);
  const methods = useForm<TProfileDataForm>({
    resolver: zodResolver(profileDataSchema),
    mode: 'onTouched',
    defaultValues: toFormValues(me),
  });
  const { isDirty, } = methods.formState;
  const email = useWatch({ control: methods.control, name: 'email', });
  const isEmailChanged = isEditing && email !== me?.email;
  const mutation = useEditMeMutation(() => setIsEditing(false));

  useEffect(() => {
    onDirtyChange(isEditing && isDirty);
  }, [isEditing, isDirty, onDirtyChange]);

  const startEditing = () => {
    methods.reset(toFormValues(me));
    mutation.reset();
    setIsEditing(true);
  };

  const submit = methods.handleSubmit(({ fullName, email, currentPassword, }) => {
    // the email is the login, so the API asks to confirm its change with the password
    if (email !== me?.email && !currentPassword) {
      methods.setError('currentPassword', { message: 'Required to change the email', });
      return;
    }
    mutation.mutate({
      fullName: fullName.trim(),
      email,
      ...(email !== me?.email ? { currentPassword, } : {}),
    });
  });

  return (
    <ProfileSection
      title={'Personal data'}
      description={'Your name is shown in schedules and lists, the email is used to sign in.'}
      headerAction={!isEditing && (
        <Button variant={'ghost'} leftIcon={<LuPencil />} className={styles['section-action']} onClick={startEditing}>
          Edit
        </Button>
      )}
    >
      {!isEditing && (
        <dl className={styles.details}>
          <div className={styles.detail}>
            <dt>Full name</dt>
            <dd>{me?.fullName}</dd>
          </div>
          <div className={styles.detail}>
            <dt>Email</dt>
            <dd>{me?.email}</dd>
          </div>
        </dl>
      )}

      <Collapse isOpen={isEditing} className={styles['section-form']}>
        <FormProvider {...methods}>
          <form className={styles.fields} onSubmit={submit}>
            <FormInput<TProfileDataForm>
              name={'fullName'}
              label={'Full name'}
              autoComplete={'name'}
              required
            />
            <FormInput<TProfileDataForm>
              name={'email'}
              label={'Email'}
              type={'email'}
              autoComplete={'email'}
              required
            />
            <Collapse isOpen={isEmailChanged}>
              <FormPasswordInput<TProfileDataForm>
                name={'currentPassword'}
                label={'Current password'}
                hint={'Confirms the new email'}
                autoComplete={'current-password'}
                required
              />
            </Collapse>
            <div className={styles['form-actions']}>
              <Button variant={'secondary'} disabled={mutation.isPending} onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type={'submit'} disabled={mutation.isPending || !isDirty} isLoading={mutation.isPending}>
                Save changes
              </Button>
            </div>
          </form>
        </FormProvider>
      </Collapse>
    </ProfileSection>
  );
}

export default PersonalDataSection;
