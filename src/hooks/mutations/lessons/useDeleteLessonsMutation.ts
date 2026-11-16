import { useTranslation } from 'react-i18next';
import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import LessonsService from '@/lib/services/lessons.service';
import { LESSON_GROUPS_INVALIDATE_KEYS } from './lesson-groups-invalidate-keys';

/** Admin panel: one or several lessons at once */
const useDeleteLessonsMutation = (onSuccess?: () => void) => {
  const { t, } = useTranslation('lessons');
  return useDictionaryMutation<string[]>({
    mutationFn: (lessonIds) => LessonsService.deleteAdminLessons(lessonIds),
    invalidateKeys: LESSON_GROUPS_INVALIDATE_KEYS,
    successMessage: t('groups.lessons.deleted'),
    onSuccess,
  });
}

export default useDeleteLessonsMutation;
