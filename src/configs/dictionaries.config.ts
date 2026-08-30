import { IRole, IRoleResponse } from '@/interfaces/dictionaries/roles';
import { IDictionaryItemTheme } from '@/interfaces/dictionaries/tables';
import RolesService, { RolesQueryKey } from '@/lib/services/roles.service';
import { BsShieldFill } from 'react-icons/bs';
import { FaTags } from 'react-icons/fa';

const PAGE_SIZE = 20;

const rolesDictionaryConfig: IDictionaryItemTheme<IRoleResponse, IRole> = {
  title: 'Roles',
  queryKey: RolesQueryKey.RolesList,
  icon: BsShieldFill({}),
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

const groupTagsDictionaryConfig: IDictionaryItemTheme<IRoleResponse, IRole> = {
  title: 'Group Tags',
  queryKey: RolesQueryKey.RolesList,
  icon: FaTags({}),
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
  roles: rolesDictionaryConfig,
  groupTags: groupTagsDictionaryConfig,
};
