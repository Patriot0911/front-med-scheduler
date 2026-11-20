import { useTranslation } from 'react-i18next';
import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import LessonsService, { LessonsQueryKey } from '@/lib/services/lessons.service';
import { LessonGroupsQueryKey } from '@/lib/services/lesson-groups.service';
import type { ICreateLessonPayload } from '@/interfaces/lessons/lesson';

// every lessons view, and the lesson counts / periods of the groups
const INVALIDATE_KEYS = [
  LessonsQueryKey.List,
  LessonsQueryKey.My,
  LessonsQueryKey.Admin,
  LessonGroupsQueryKey.AdminList,
  LessonGroupsQueryKey.UsableList,
];

const useCreateLessonMutation = (onSuccess?: () => void) => {
  const { t, } = useTranslation('lessons');
  return useDictionaryMutation<ICreateLessonPayload>({
    mutationFn: LessonsService.createLesson,
    invalidateKeys: INVALIDATE_KEYS,
    successMessage: t('form.created'),
    onSuccess,
  });
}

export default useCreateLessonMutation;
