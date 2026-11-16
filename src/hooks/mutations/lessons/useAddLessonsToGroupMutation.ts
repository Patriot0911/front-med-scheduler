import { useTranslation } from 'react-i18next';
import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import { LessonsQueryKey } from '@/lib/services/lessons.service';
import LessonGroupsService, { LessonGroupsQueryKey } from '@/lib/services/lesson-groups.service';
import type { IAddLessonsToGroupPayload } from '@/interfaces/lessons/lesson';

const INVALIDATE_KEYS = [
  LessonsQueryKey.List,
  LessonsQueryKey.My,
  LessonsQueryKey.Admin,
  LessonGroupsQueryKey.AdminList,
];

const useAddLessonsToGroupMutation = (onSuccess?: () => void) => {
  const { t, } = useTranslation('lessons');
  return useDictionaryMutation<{ lessonGroupId: string; payload: IAddLessonsToGroupPayload }>({
    mutationFn: ({ lessonGroupId, payload, }) => LessonGroupsService.addLessonsToGroup(lessonGroupId, payload),
    invalidateKeys: INVALIDATE_KEYS,
    successMessage: t('form.addedToGroup'),
    onSuccess,
  });
}

export default useAddLessonsToGroupMutation;
