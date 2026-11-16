'use client';

import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TUserForm, userSchema } from './user.scheme';
import type { IUser, IUserFormModalProps, IUserPayload } from '@/interfaces/users/users';
import type { ISelectOption } from '@/interfaces/ui/selectors';
import UsersService, { UsersQueryKey } from '@/lib/services/users.service';
import { DictionaryQueryKey } from '@/lib/services/dictionaries.service';
import { DepartmentsQueryKey } from '@/lib/services/departments.service';
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
import InitialPasswordField from './InitialPasswordField';

import styles from './styles.module.scss';

const toFormValues = (user: IUser | null): TUserForm => ({
  fullName: user?.fullName ?? '',
  email: user?.email ?? '',
  password: '',
  roleIds: user?.roleIds ?? [],
  isTeacher: !!user?.teacher,
  departmentId: user?.teacher?.departmentId ?? '',
  isStudent: !!user?.student,
  studentGroupId: user?.student?.studentGroupId ?? '',
  isGroupMonitor: user?.student?.isGroupMonitor ?? false,
});

/** Roles are sent only when the user can see them, otherwise an edit keeps the current ones */
const toPayload = (data: TUserForm, canAssignRoles: boolean): IUserPayload => ({
  fullName: data.fullName.trim(),
  email: data.email,
  roleIds: canAssignRoles ? data.roleIds : undefined,
  teacher: data.isTeacher ? { departmentId: data.departmentId || null, } : null,
  student: data.isStudent
    ? { studentGroupId: data.studentGroupId || null, isGroupMonitor: data.isGroupMonitor, }
    : null,
});

const toOptions = (notAssigned: string, items: { id: string; name: string }[] = []): ISelectOption[] => [
  { value: '', label: notAssigned, },
  ...items.map((item) => ({ value: item.id, label: item.name, })),
];

/** Creates a user with optional roles and teacher / student profiles, or edits an existing one. */
const UserFormModal = ({ isOpen, item, onClose, canAssignRoles, }: IUserFormModalProps) => {
  const { t, } = useTranslation('users');
  const isEdit = !!item;
  const methods = useForm<TUserForm>({
    resolver: zodResolver(userSchema),
    mode: 'onTouched',
    defaultValues: toFormValues(item),
  });
  const isTeacher = useWatch({ control: methods.control, name: 'isTeacher', });
  const isStudent = useWatch({ control: methods.control, name: 'isStudent', });

  const { data: roles, } = useRolesDictionaryQuery(isOpen && canAssignRoles);
  const { data: departments, } = useDepartmentsDictionaryQuery(isOpen && isTeacher);
  const { data: groups, } = useStudentGroupsDictionaryQuery(isOpen && isStudent);

  const mutation = useDictionaryMutation({
    mutationFn: (data: TUserForm) => {
      const payload = toPayload(data, canAssignRoles);
      return item
        ? UsersService.updateUser(item, payload)
        : UsersService.createUser({ ...payload, password: data.password || undefined, });
    },
    // teacher profiles feed the teachers lists (departments, lessons)
    invalidateKeys: [UsersQueryKey.UsersList, DictionaryQueryKey.Teachers, DepartmentsQueryKey.DepartmentsList],
    successMessage: item ? t('updated') : t('created'),
    onSuccess: onClose,
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset(toFormValues(item));
      mutation.reset();
    }
  }, [isOpen, item]);

  return (
    <DictionaryModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t('form.editTitle') : t('form.createTitle')}
      description={isEdit ? t('form.editDescription') : t('form.createDescription')}
      methods={methods}
      onSubmit={(data: TUserForm) => mutation.mutate(data)}
      isPending={mutation.isPending}
      isEdit={isEdit}
    >
      <FormInput<TUserForm>
        name={'fullName'}
        label={t('form.fullName')}
        placeholder={t('form.fullNamePlaceholder')}
        required
      />
      <FormInput<TUserForm>
        name={'email'}
        label={t('form.email')}
        type={'email'}
        placeholder={t('form.emailPlaceholder')}
        required
      />
      {canAssignRoles && (
        <FormMultiSelect<TUserForm, ISelectOption>
          name={'roleIds'}
          label={t('form.roles')}
          options={(roles ?? []).map((role) => ({ value: role.id, label: role.name, }))}
          placeholder={t('noRoles')}
          hideErrorMessage
          searchPlaceholder={t('form.searchRole')}
          hint={t('form.rolesHint')}
          searchable
        />
      )}
      {!isEdit && <InitialPasswordField />}

      <section className={styles.profile}>
        <FormSwitch<TUserForm>
          name={'isTeacher'}
          label={t('form.teacherProfile')}
          hint={t('form.teacherProfileHint')}
        />
        <Collapse isOpen={isTeacher} className={styles['profile-fields']}>
          <FormSelect<TUserForm, ISelectOption>
            name={'departmentId'}
            label={t('form.department')}
            options={toOptions(t('notAssigned'), departments)}
            placeholder={t('notAssigned')}
            hideErrorMessage
            searchable
          >
            <FormSelect.Selected<ISelectOption>>
              {(option) => option.label}
            </FormSelect.Selected>
            <FormSelect.Area>
              <FormSelect.Search placeholder={t('form.searchDepartment')} />
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
          label={t('form.studentProfile')}
          hint={t('form.studentProfileHint')}
        />
        <Collapse isOpen={isStudent} className={styles['profile-fields']}>
          <FormSelect<TUserForm, ISelectOption>
            name={'studentGroupId'}
            label={t('form.studentGroup')}
            options={toOptions(t('notAssigned'), groups)}
            placeholder={t('notAssigned')}
            hideErrorMessage
            searchable
          >
            <FormSelect.Selected<ISelectOption>>
              {(option) => option.label}
            </FormSelect.Selected>
            <FormSelect.Area>
              <FormSelect.Search placeholder={t('form.searchGroup')} />
              <FormSelect.Option<ISelectOption>>
                {(option) => option.label}
              </FormSelect.Option>
            </FormSelect.Area>
          </FormSelect>
          <FormSwitch<TUserForm>
            name={'isGroupMonitor'}
            label={t('form.groupMonitor')}
            disabled={!methods.getValues('studentGroupId')}
          />
        </Collapse>
      </section>
    </DictionaryModal>
  );
}

export default UserFormModal;
