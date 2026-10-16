'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { IRole } from '@/interfaces/dictionaries/roles';
import type { IDictionaryFormModalProps } from '@/interfaces/dictionaries/tables';
import { Permission } from '@/interfaces/auth/permission';
import RolesService, { RolesQueryKey } from '@/lib/services/roles.service';
import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import usePermissionsDictionaryQuery from '@/hooks/queries/dictionaries/usePermissionsDictionaryQuery';
import { getPermissionLabel } from '@/configs/permissions.config';
import DictionaryModal from '@/components/modals/DictionaryModal';
import FormInput from '@/components/ui/FormInput';
import FormCheckboxGroup from '@/components/ui/FormCheckboxGroup';

const roleSchema = z.object({
  name: z.string().trim().min(3, 'Min 3 chars'),
  rolePriority: z.string()
    .regex(/^\d+$/, 'Whole number from 0 to 256')
    .refine((value) => Number(value) <= 256, 'Whole number from 0 to 256'),
  permissions: z.array(z.enum(Permission)),
});

type TRoleForm = z.infer<typeof roleSchema>;

const toFormValues = (role: IRole | null): TRoleForm => ({
  name: role?.name ?? '',
  rolePriority: String(role?.rolePriority ?? 1),
  permissions: role?.permissions ?? [],
});

const RoleFormModal = ({ isOpen, item, onClose }: IDictionaryFormModalProps<IRole>) => {
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
    successMessage: item ? 'Role updated' : 'Role created',
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
      title={item ? 'Edit role' : 'New role'}
      description={'Roles bundle permissions. A user can only grant permissions within their own role priority.'}
      methods={methods}
      onSubmit={(data: TRoleForm) => mutation.mutate(data)}
      isPending={mutation.isPending}
      isEdit={!!item}
    >
      <FormInput<TRoleForm>
        name={'name'}
        label={'Name'}
        placeholder={'e.g. Teacher'}
        required
      />
      <FormInput<TRoleForm>
        name={'rolePriority'}
        label={'Priority'}
        type={'number'}
        min={0}
        max={256}
        hint={'0 – 256'}
        required
      />
      <FormCheckboxGroup<TRoleForm>
        name={'permissions'}
        label={'Permissions'}
        options={(permissions ?? []).map((permission) => ({
          value: permission,
          label: getPermissionLabel(permission),
        }))}
        emptyText={'Loading permissions…'}
      />
    </DictionaryModal>
  );
}

export default RoleFormModal;
