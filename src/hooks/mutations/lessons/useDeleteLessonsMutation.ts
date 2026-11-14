import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import LessonsService from '@/lib/services/lessons.service';
import { LESSON_GROUPS_INVALIDATE_KEYS } from './lesson-groups-invalidate-keys';

/** Admin panel: one or several lessons at once */
const useDeleteLessonsMutation = (onSuccess?: () => void) => {
  return useDictionaryMutation<string[]>({
    mutationFn: (lessonIds) => LessonsService.deleteAdminLessons(lessonIds),
    invalidateKeys: LESSON_GROUPS_INVALIDATE_KEYS,
    successMessage: 'Lessons deleted',
    onSuccess,
  });
}

export default useDeleteLessonsMutation;
