import { useQuery } from '@tanstack/react-query';
import UsersService, { UsersQueryKey } from '@/lib/services/users.service';
import { IUsersFilters } from '@/interfaces/users/users';

const useUsersTableQuery = (page: number, pageSize: number, search: string, filters: IUsersFilters) => {
  return useQuery({
    queryKey: [UsersQueryKey.UsersList, page, search, filters],
    queryFn: () => UsersService.getUsers({
      page,
      pageSize,
      ...(search ? { search, } : {}),
      ...(filters.roleIds.length ? { roleIds: filters.roleIds, } : {}),
      ...(filters.profiles.length ? { profiles: filters.profiles, } : {}),
    }),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });
}

export default useUsersTableQuery;
