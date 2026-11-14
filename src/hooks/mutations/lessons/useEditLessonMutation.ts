import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import LessonsService, { LessonsQueryKey } from '@/lib/services/lessons.service';
import { LessonGroupsQueryKey } from '@/lib/services/lesson-groups.service';
import type { TLessonsSource } from '@/interfaces/lessons/filters';
import type { IEditLessonPayload } from '@/interfaces/lessons/lesson';

const INVALIDATE_KEYS = [
  LessonsQueryKey.List,
  LessonsQueryKey.My,
  LessonsQueryKey.Admin,
  LessonGroupsQueryKey.AdminList,
];

/** The admin panel edits through /admin/lessons, every other view through the teacher domain */
const useEditLessonMutation = (source: TLessonsSource, onSuccess?: () => void) => {
  return useDictionaryMutation<{ lessonId: string; payload: IEditLessonPayload }>({
    mutationFn: ({ lessonId, payload, }) => (source === 'admin'
      ? LessonsService.editAdminLesson(lessonId, payload)
      : LessonsService.editLesson(lessonId, payload)),
    invalidateKeys: INVALIDATE_KEYS,
    successMessage: 'Lesson saved',
    onSuccess,
  });
}

export default useEditLessonMutation;
