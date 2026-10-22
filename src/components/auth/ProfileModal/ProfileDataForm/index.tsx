'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IProfileFormProps } from '@/interfaces/auth/profile';
import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import useEditMeMutation from '@/hooks/mutations/auth/useEditMeMutation';
import Modal from '@/components/ui/Modal';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import ProfileSection from '../ProfileSection';
import { profileDataSchema, TProfileDataForm } from '../profile.scheme';

/** Name and email of the current user. */
const ProfileDataForm = ({ className, }: IProfileFormProps) => {
  const { data: me, } = useMeQuery();
  const methods = useForm<TProfileDataForm>({
    resolver: zodResolver(profileDataSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: me?.fullName ?? '',
      email: me?.email ?? '',
    },
  });
  // the saved data becomes the new baseline, so "Save" is disabled until the next change
  const mutation = useEditMeMutation(({ fullName, email, }) => methods.reset({ fullName, email, }));

  return (
    <Modal.FormBody
      className={className}
      methods={methods}
      onSubmit={methods.handleSubmit((data) => mutation.mutate({ ...data, fullName: data.fullName.trim(), }))}
    >
      <ProfileSection
        title={'Personal data'}
        description={'Your name is shown in schedules and lists, the email is used to sign in.'}
        action={(
          <Button
            type={'submit'}
            disabled={mutation.isPending || !methods.formState.isDirty}
            isLoading={mutation.isPending}
          >
            Save changes
          </Button>
        )}
      >
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
      </ProfileSection>
    </Modal.FormBody>
  );
}

export default ProfileDataForm;
