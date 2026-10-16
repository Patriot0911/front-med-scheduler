import { useQuery } from '@tanstack/react-query';
import DictionariesService, { DictionaryQueryKey } from '@/lib/services/dictionaries.service';

const usePermissionsDictionaryQuery = (enabled = true) => {
  return useQuery({
    queryKey: [DictionaryQueryKey.Permissions],
    queryFn: DictionariesService.getPermissions,
    staleTime: Infinity,
    enabled,
  });
}

export default usePermissionsDictionaryQuery;
