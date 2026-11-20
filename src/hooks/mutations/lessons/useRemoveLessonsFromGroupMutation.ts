import { useTranslation } from 'react-i18next';
import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import LessonGroupsService from '@/lib/services/lesson-groups.service';
import type { TLessonGroupsSource } from '@/interfaces/lessons/lesson-group';
import { LESSON_GROUPS_INVALIDATE_KEYS } from './lesson-groups-invalidate-keys';

const REMOVE = {
  admin: LessonGroupsService.removeAdminLessons,
  usable: LessonGroupsService.removeLessons,
} satisfies Record<TLessonGroupsSource, unknown>;

/** The lessons stay, without a group */
const useRemoveLessonsFromGroupMutation = (source: TLessonGroupsSource, onSuccess?: () => void) => {
  const { t, } = useTranslation('lessons');
  return useDictionaryMutation<{ lessonGroupId: string; lessonIds: string[] }>({
    mutationFn: ({ lessonGroupId, lessonIds, }) => REMOVE[source](lessonGroupId, lessonIds),
    invalidateKeys: LESSON_GROUPS_INVALIDATE_KEYS,
    successMessage: t('groups.lessons.takenOut'),
    onSuccess,
  });
}

export default useRemoveLessonsFromGroupMutation;
