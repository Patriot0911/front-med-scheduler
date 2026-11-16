'use client';

import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleSchema, TRoleForm } from './role.scheme';
import type { IRole } from '@/interfaces/dictionaries/roles';
import type { IDictionaryFormModalProps } from '@/interfaces/dictionaries/tables';
import RolesService, { RolesQueryKey } from '@/lib/services/roles.service';
import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import usePermissionsDictionaryQuery from '@/hooks/queries/dictionaries/usePermissionsDictionaryQuery';
import { getPermissionLabel } from '@/configs/permissions.config';
import DictionaryModal from '@/components/modals/DictionaryModal';
import FormInput from '@/components/ui/FormInput';
import FormCheckboxGroup from '@/components/ui/FormCheckboxGroup';

const toFormValues = (role: IRole | null): TRoleForm => ({
  name: role?.name ?? '',
  rolePriority: String(role?.rolePriority ?? 1),
  permissions: role?.permissions ?? [],
});

const RoleFormModal = ({ isOpen, item, onClose }: IDictionaryFormModalProps<IRole>) => {
  const { t, } = useTranslation('dictionaries');
  const { data: permissions, } = usePermissionsDictionaryQuery(isOpen);
  const methods = useForm<TRoleForm>({
    resolver: zodResolver(roleSchema),
    mode: 'onTouched',
    defaultValues: toFormValues(item),
  });

  const mutation = useDictionaryMutation({
    mutationFn: ({ name, rolePriority, permissions, }: TRoleForm) => {
      const payload = { name, rolePriority: Number(rolePriority), permissions, };
      return item ? RolesService.editRole(item.id, payload) : RolesService.createRole(payload);
    },
    invalidateKeys: [RolesQueryKey.RolesList],
    successMessage: item ? t('roles.updated') : t('roles.created'),
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
      title={item ? t('roles.form.editTitle') : t('roles.form.createTitle')}
      description={item ? t('roles.form.editDescription') : t('roles.form.createDescription')}
      methods={methods}
      onSubmit={(data: TRoleForm) => mutation.mutate(data)}
      isPending={mutation.isPending}
      isEdit={!!item}
    >
      <FormInput<TRoleForm>
        name={'name'}
        label={t('fields.name')}
        placeholder={t('roles.form.namePlaceholder')}
        required
      />
      <FormInput<TRoleForm>
        name={'rolePriority'}
        label={t('roles.form.priority')}
        type={'number'}
        min={0}
        max={256}
        hint={t('roles.form.priorityHint')}
        required
      />
      <FormCheckboxGroup<TRoleForm>
        name={'permissions'}
        label={t('roles.form.permissions')}
        options={(permissions ?? []).map((permission) => ({
          value: permission,
          label: getPermissionLabel(permission),
        }))}
        emptyText={t('roles.form.loadingPermissions')}
      />
    </DictionaryModal>
  );
}

export default RoleFormModal;
