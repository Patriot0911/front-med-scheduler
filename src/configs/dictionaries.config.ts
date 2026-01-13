import type { IRole } from '@/interfaces/dictionaries/roles';
import type { ITableColumn } from '@/interfaces/ui/table';
import RolesService, { RolesQueryKey } from '@/lib/services/roles.service';

export const rolesTableColumns: ITableColumn<IRole>[] = [
  {
    title: 'Name',
    name: 'name',
  },
  {
    title: 'Permissions',
    name: 'permissions',
  },
] as const;

export const dictionariesConfig = {
  roles: {
    title: 'Roles',
    queryKey: [RolesQueryKey.RolesList],
    queryFn: () => RolesService.getRoles(),
    columns: rolesTableColumns,
  },
} as const;
