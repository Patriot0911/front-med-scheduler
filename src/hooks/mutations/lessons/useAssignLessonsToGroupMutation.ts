import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import LessonGroupsService from '@/lib/services/lesson-groups.service';
import { LESSON_GROUPS_INVALIDATE_KEYS } from './lesson-groups-invalidate-keys';

/** Existing lessons into a group (admin panel) */
const useAssignLessonsToGroupMutation = (onSuccess?: () => void) => {
  return useDictionaryMutation<{ lessonGroupId: string; lessonIds: string[] }>({
    mutationFn: ({ lessonGroupId, lessonIds, }) => LessonGroupsService.assignAdminLessons(lessonGroupId, lessonIds),
    invalidateKeys: LESSON_GROUPS_INVALIDATE_KEYS,
    successMessage: 'Lessons added to the group',
    onSuccess,
  });
}

export default useAssignLessonsToGroupMutation;
