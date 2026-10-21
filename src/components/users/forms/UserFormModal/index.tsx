'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TUserForm, userSchema } from './user.scheme';
import type { ICreateUserPayload, IUserFormModalProps } from '@/interfaces/users/users';
import type { ISelectOption } from '@/interfaces/ui/selectors';
import UsersService, { UsersQueryKey } from '@/lib/services/users.service';
import { DictionaryQueryKey } from '@/lib/services/dictionaries.service';
import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import useRolesDictionaryQuery from '@/hooks/queries/dictionaries/useRolesDictionaryQuery';
import useDepartmentsDictionaryQuery from '@/hooks/queries/dictionaries/useDepartmentsDictionaryQuery';
import useStudentGroupsDictionaryQuery from '@/hooks/queries/dictionaries/useStudentGroupsDictionaryQuery';
import DictionaryModal from '@/components/modals/DictionaryModal';
import FormInput from '@/components/ui/FormInput';
import FormSelect from '@/components/ui/FormSelect';
import FormMultiSelect from '@/components/ui/FormMultiSelect';
import FormSwitch from '@/components/ui/FormSwitch';
import Collapse from '@/components/ui/Collapse';

import styles from './styles.module.scss';

const NOT_ASSIGNED_OPTION: ISelectOption = { value: '', label: 'Not assigned', };

const DEFAULT_VALUES: TUserForm = {
  fullName: '',
  email: '',
  roleIds: [],
  isTeacher: false,
  departmentId: '',
  isStudent: false,
  studentGroupId: '',
  isGroupMonitor: false,
};

const toPayload = (data: TUserForm): ICreateUserPayload => ({
  fullName: data.fullName.trim(),
  email: data.email,
  roleIds: data.roleIds,
  teacher: data.isTeacher ? { departmentId: data.departmentId || null, } : null,
  student: data.isStudent
    ? { studentGroupId: data.studentGroupId || undefined, isGroupMonitor: data.isGroupMonitor, }
    : null,
});

const toOptions = (items: { id: string; name: string }[] = []): ISelectOption[] => [
  NOT_ASSIGNED_OPTION,
  ...items.map((item) => ({ value: item.id, label: item.name, })),
];

/** Creates a user with optional roles and teacher / student profiles (POST /users). */
const UserFormModal = ({ isOpen, onClose, canAssignRoles, }: IUserFormModalProps) => {
  const methods = useForm<TUserForm>({
    resolver: zodResolver(userSchema),
    mode: 'onTouched',
    defaultValues: DEFAULT_VALUES,
  });
  const isTeacher = useWatch({ control: methods.control, name: 'isTeacher', });
  const isStudent = useWatch({ control: methods.control, name: 'isStudent', });

  const { data: roles, } = useRolesDictionaryQuery(isOpen && canAssignRoles);
  const { data: departments, } = useDepartmentsDictionaryQuery(isOpen && isTeacher);
  const { data: groups, } = useStudentGroupsDictionaryQuery(isOpen && isStudent);

  const mutation = useDictionaryMutation({
    mutationFn: (data: TUserForm) => UsersService.createUser(toPayload(data)),
    // a new teacher shows up in the teachers lists (departments, lessons)
    invalidateKeys: [UsersQueryKey.UsersList, DictionaryQueryKey.Teachers],
    successMessage: 'User created',
    onSuccess: onClose,
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset(DEFAULT_VALUES);
      mutation.reset();
    }
  }, [isOpen]);

  return (
    <DictionaryModal
      isOpen={isOpen}
      onClose={onClose}
      title={'New user'}
      description={'A random password is generated for the account. The user sets their own via a password reset link.'}
      methods={methods}
      onSubmit={(data: TUserForm) => mutation.mutate(data)}
      isPending={mutation.isPending}
      isEdit={false}
    >
      <FormInput<TUserForm>
        name={'fullName'}
        label={'Full name'}
        placeholder={'e.g. John Doe'}
        required
      />
      <FormInput<TUserForm>
        name={'email'}
        label={'Email'}
        type={'email'}
        placeholder={'e.g. john.doe@example.com'}
        required
      />
      {canAssignRoles && (
        <FormMultiSelect<TUserForm, ISelectOption>
          name={'roleIds'}
          label={'Roles'}
          options={(roles ?? []).map((role) => ({ value: role.id, label: role.name, }))}
          placeholder={'No roles'}
          searchPlaceholder={'Search role…'}
          hint={'You can only assign roles within your own role priority'}
          searchable
        />
      )}

      <section className={styles.profile}>
        <FormSwitch<TUserForm>
          name={'isTeacher'}
          label={'Teacher profile'}
          hint={'Can be assigned to lessons and departments'}
        />
        <Collapse isOpen={isTeacher} className={styles['profile-fields']}>
          <FormSelect<TUserForm, ISelectOption>
            name={'departmentId'}
            label={'Department'}
            options={toOptions(departments)}
            placeholder={'Not assigned'}
            hideErrorMessage
            searchable
          >
            <FormSelect.Selected<ISelectOption>>
              {(option) => option.label}
            </FormSelect.Selected>
            <FormSelect.Area>
              <FormSelect.Search placeholder={'Search department…'} />
              <FormSelect.Option<ISelectOption>>
                {(option) => option.label}
              </FormSelect.Option>
            </FormSelect.Area>
          </FormSelect>
        </Collapse>
      </section>

      <section className={styles.profile}>
        <FormSwitch<TUserForm>
          name={'isStudent'}
          label={'Student profile'}
          hint={'Belongs to a student group'}
        />
        <Collapse isOpen={isStudent} className={styles['profile-fields']}>
          <FormSelect<TUserForm, ISelectOption>
            name={'studentGroupId'}
            label={'Student group'}
            options={toOptions(groups)}
            placeholder={'Not assigned'}
            hideErrorMessage
            searchable
          >
            <FormSelect.Selected<ISelectOption>>
              {(option) => option.label}
            </FormSelect.Selected>
            <FormSelect.Area>
              <FormSelect.Search placeholder={'Search group…'} />
              <FormSelect.Option<ISelectOption>>
                {(option) => option.label}
              </FormSelect.Option>
            </FormSelect.Area>
          </FormSelect>
          <FormSwitch<TUserForm>
            name={'isGroupMonitor'}
            label={'Group monitor'}
            disabled={!methods.getValues('studentGroupId')}
          />
        </Collapse>
      </section>
    </DictionaryModal>
  );
}

export default UserFormModal;
