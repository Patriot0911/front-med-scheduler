import { useQuery } from '@tanstack/react-query';
import DictionariesService, { DictionaryQueryKey } from '@/lib/services/dictionaries.service';

const useRolesDictionaryQuery = (enabled = true) => {
  return useQuery({
    queryKey: [DictionaryQueryKey.Roles],
    queryFn: DictionariesService.getRoles,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

export default useRolesDictionaryQuery;
