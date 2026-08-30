import { IRole, IRoleResponse } from '@/interfaces/dictionaries/roles';
import { IDictionaryItemTheme } from '@/interfaces/dictionaries/tables';
import RolesService, { RolesQueryKey } from '@/lib/services/roles.service';

const PAGE_SIZE = 20;

const roleDictionaryConfig: IDictionaryItemTheme<IRoleResponse, IRole> = {
  title: 'Roles',
  queryKey: RolesQueryKey.RolesList,
  queryFn: (page: number) => RolesService.getRoles({ page, pageSize: PAGE_SIZE, }),
  columns: [
    {
      key: 'name',
      title: 'Name',
      dataBind: 'name',
    },
    {
      key: 'permissions',
      title: 'Permissions',
      dataBind: 'permissions',
    }
  ],
};

export const dictionariesConfig = {
  roles: roleDictionaryConfig,
};
