import { useQuery } from '@tanstack/react-query';
import DictionariesService, { DictionaryQueryKey } from '@/lib/services/dictionaries.service';

const useLessonGroupsDictionaryQuery = (enabled = true) => {
  return useQuery({
    queryKey: [DictionaryQueryKey.LessonGroups],
    queryFn: DictionariesService.getLessonGroups,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

export default useLessonGroupsDictionaryQuery;
