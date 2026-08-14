import RolesService, { RolesQueryKey } from '@/lib/services/roles.service';

const PAGE_SIZE = 20;

export const dictionariesConfig = {
  roles: {
    title: 'Roles',
    queryKey: RolesQueryKey.RolesList,
    queryFn: (page: number) => RolesService.getRoles({ page, pageSize: PAGE_SIZE, }),
  },
} as const;
