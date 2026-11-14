import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import { LessonsQueryKey } from '@/lib/services/lessons.service';
import LessonGroupsService, { LessonGroupsQueryKey } from '@/lib/services/lesson-groups.service';
import { DictionaryQueryKey } from '@/lib/services/dictionaries.service';
import type { ICreateLessonSeriesPayload } from '@/interfaces/lessons/lesson';

const INVALIDATE_KEYS = [
  LessonsQueryKey.List,
  LessonsQueryKey.My,
  LessonsQueryKey.Admin,
  LessonGroupsQueryKey.AdminList,
  LessonGroupsQueryKey.My,
  DictionaryQueryKey.LessonGroups,
];

const useCreateLessonSeriesMutation = (onSuccess?: () => void) => {
  return useDictionaryMutation<ICreateLessonSeriesPayload>({
    mutationFn: LessonGroupsService.createLessonSeries,
    invalidateKeys: INVALIDATE_KEYS,
    successMessage: 'Lessons created',
    onSuccess,
  });
}

export default useCreateLessonSeriesMutation;
