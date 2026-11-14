import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import LessonGroupsService from '@/lib/services/lesson-groups.service';
import { LESSON_GROUPS_INVALIDATE_KEYS } from './lesson-groups-invalidate-keys';

const useDeleteLessonGroupMutation = (onSuccess?: () => void) => {
  return useDictionaryMutation<{ lessonGroupId: string; withLessons: boolean }>({
    mutationFn: ({ lessonGroupId, withLessons, }) => LessonGroupsService.deleteAdminLessonGroup(lessonGroupId, withLessons),
    invalidateKeys: LESSON_GROUPS_INVALIDATE_KEYS,
    successMessage: 'Lesson group deleted',
    onSuccess,
  });
}

export default useDeleteLessonGroupMutation;
