import type { TLessonsView } from './filters';
import type { TLessonGroupsSource } from './lesson-group';

export type TTeachingLessonsTab = 'teaching' | 'department';

export type TLessonsListTab = 'lessons' | 'lesson-groups';

export interface ILessonsListPanelProps {
  view: TLessonsView;
  canEdit: boolean;
  groupsSource: TLessonGroupsSource;
  canManageGroups: boolean;
  /** Query parameter of the lessons / lesson groups switch */
  tabParam: string;
};
