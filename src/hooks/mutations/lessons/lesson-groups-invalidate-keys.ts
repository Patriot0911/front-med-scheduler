import { LessonsQueryKey } from '@/lib/services/lessons.service';
import { LessonGroupsQueryKey } from '@/lib/services/lesson-groups.service';
import { DictionaryQueryKey } from '@/lib/services/dictionaries.service';

/** Everything that shows lessons or lesson groups: calendars, lists, group pickers and filters */
export const LESSON_GROUPS_INVALIDATE_KEYS: string[] = [
  LessonsQueryKey.List,
  LessonsQueryKey.My,
  LessonsQueryKey.Admin,
  LessonGroupsQueryKey.AdminList,
  LessonGroupsQueryKey.My,
  DictionaryQueryKey.LessonGroups,
];
