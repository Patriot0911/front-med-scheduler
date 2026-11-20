import { useTranslation } from 'react-i18next';
import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import LessonGroupsService from '@/lib/services/lesson-groups.service';
import type { TLessonGroupsSource } from '@/interfaces/lessons/lesson-group';
import { LESSON_GROUPS_INVALIDATE_KEYS } from './lesson-groups-invalidate-keys';

const ASSIGN = {
  admin: LessonGroupsService.assignAdminLessons,
  usable: LessonGroupsService.assignLessons,
} satisfies Record<TLessonGroupsSource, unknown>;

/** Existing lessons into a group */
const useAssignLessonsToGroupMutation = (source: TLessonGroupsSource, onSuccess?: () => void) => {
  const { t, } = useTranslation('lessons');
  return useDictionaryMutation<{ lessonGroupId: string; lessonIds: string[] }>({
    mutationFn: ({ lessonGroupId, lessonIds, }) => ASSIGN[source](lessonGroupId, lessonIds),
    invalidateKeys: LESSON_GROUPS_INVALIDATE_KEYS,
    successMessage: t('form.addedToGroup'),
    onSuccess,
  });
}

export default useAssignLessonsToGroupMutation;
