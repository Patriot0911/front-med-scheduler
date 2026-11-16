import { useTranslation } from 'react-i18next';
import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import LessonGroupsService from '@/lib/services/lesson-groups.service';
import { LESSON_GROUPS_INVALIDATE_KEYS } from './lesson-groups-invalidate-keys';

/** The lessons stay, without a group (admin panel) */
const useRemoveLessonsFromGroupMutation = (onSuccess?: () => void) => {
  const { t, } = useTranslation('lessons');
  return useDictionaryMutation<{ lessonGroupId: string; lessonIds: string[] }>({
    mutationFn: ({ lessonGroupId, lessonIds, }) => LessonGroupsService.removeAdminLessons(lessonGroupId, lessonIds),
    invalidateKeys: LESSON_GROUPS_INVALIDATE_KEYS,
    successMessage: t('groups.lessons.takenOut'),
    onSuccess,
  });
}

export default useRemoveLessonsFromGroupMutation;
