import { useQuery } from '@tanstack/react-query';
import DictionariesService, { DictionaryQueryKey } from '@/lib/services/dictionaries.service';

const useGroupTagsDictionaryQuery = (enabled = true) => {
  return useQuery({
    queryKey: [DictionaryQueryKey.GroupTags],
    queryFn: DictionariesService.getGroupTags,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

export default useGroupTagsDictionaryQuery;
