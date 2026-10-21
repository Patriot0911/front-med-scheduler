import { useQuery } from '@tanstack/react-query';
import DictionariesService, { DictionaryQueryKey } from '@/lib/services/dictionaries.service';

const useStudentGroupsDictionaryQuery = (enabled = true) => {
  return useQuery({
    queryKey: [DictionaryQueryKey.StudentGroups],
    queryFn: DictionariesService.getStudentGroups,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

export default useStudentGroupsDictionaryQuery;
