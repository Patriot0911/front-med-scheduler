import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import LessonGroupsService from '@/lib/services/lesson-groups.service';
import type { IEditLessonGroupPayload } from '@/interfaces/lessons/lesson-group';
import { LESSON_GROUPS_INVALIDATE_KEYS } from './lesson-groups-invalidate-keys';

const useEditLessonGroupMutation = (onSuccess?: () => void) => {
  return useDictionaryMutation<{ lessonGroupId: string; payload: IEditLessonGroupPayload }>({
    mutationFn: ({ lessonGroupId, payload, }) => LessonGroupsService.editAdminLessonGroup(lessonGroupId, payload),
    invalidateKeys: LESSON_GROUPS_INVALIDATE_KEYS,
    successMessage: 'Lesson group saved',
    onSuccess,
  });
}

export default useEditLessonGroupMutation;
