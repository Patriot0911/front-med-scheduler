import { useQuery } from '@tanstack/react-query';
import DictionariesService, { DictionaryQueryKey } from '@/lib/services/dictionaries.service';

const useSemestersDictionaryQuery = (enabled = true) => {
  return useQuery({
    queryKey: [DictionaryQueryKey.Semesters],
    queryFn: DictionariesService.getSemesters,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

export default useSemestersDictionaryQuery;
