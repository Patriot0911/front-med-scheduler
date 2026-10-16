import { useQuery } from '@tanstack/react-query';
import DictionariesService, { DictionaryQueryKey } from '@/lib/services/dictionaries.service';

const useTeachersDictionaryQuery = (enabled = true) => {
  return useQuery({
    queryKey: [DictionaryQueryKey.Teachers],
    queryFn: DictionariesService.getTeachers,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

export default useTeachersDictionaryQuery;
