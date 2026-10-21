import { useQuery } from '@tanstack/react-query';
import DictionariesService, { DictionaryQueryKey } from '@/lib/services/dictionaries.service';

const useDepartmentsDictionaryQuery = (enabled = true) => {
  return useQuery({
    queryKey: [DictionaryQueryKey.Departments],
    queryFn: DictionariesService.getDepartments,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

export default useDepartmentsDictionaryQuery;
