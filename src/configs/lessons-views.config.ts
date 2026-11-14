import type { ILessonsFilters, ILessonsListFilterConfig, ILessonsViewConfig, TLessonsListFilterKey, TLessonsView } from '@/interfaces/lessons/filters';

export const DEFAULT_LESSON_DURATION = 90;

export const EMPTY_LESSONS_FILTERS: ILessonsFilters = {
  lessonGroupIds: [],
  teacherIds: [],
  studentGroupIds: [],
  groupTagIds: [],
  departmentIds: [],
  semesterIds: [],
  visibility: '',
};

export const LESSONS_LIST_FILTERS: Record<TLessonsListFilterKey, ILessonsListFilterConfig> = {
  lessonGroupIds: { label: 'Course', placeholder: 'All courses', searchPlaceholder: 'Search course…', },
  teacherIds: { label: 'Teacher', placeholder: 'All teachers', searchPlaceholder: 'Search teacher…', },
  studentGroupIds: { label: 'Student group', placeholder: 'All groups', searchPlaceholder: 'Search group…', },
  groupTagIds: { label: 'Group tag', placeholder: 'All tags', searchPlaceholder: 'Search tag…', },
  departmentIds: { label: 'Department', placeholder: 'All departments', searchPlaceholder: 'Search department…', },
  semesterIds: { label: 'Semester', placeholder: 'All semesters', searchPlaceholder: 'Search semester…', },
};

export const LESSONS_VIEWS: Record<TLessonsView, ILessonsViewConfig> = {
  study: {
    source: 'my',
    scope: 'studying',
    filters: ['lessonGroupIds', 'teacherIds', 'semesterIds'],
  },
  teaching: {
    source: 'my',
    scope: 'teaching',
    canCreate: true,
    filters: ['lessonGroupIds', 'studentGroupIds', 'groupTagIds', 'semesterIds', 'visibility'],
  },
  department: {
    source: 'my',
    scope: 'department',
    canCreate: true,
    filters: ['lessonGroupIds', 'teacherIds', 'studentGroupIds', 'groupTagIds', 'semesterIds', 'visibility'],
  },
  all: {
    source: 'list',
    filters: ['teacherIds', 'studentGroupIds', 'departmentIds'],
  },
  admin: {
    source: 'admin',
    filters: ['lessonGroupIds', 'teacherIds', 'studentGroupIds', 'groupTagIds', 'departmentIds', 'semesterIds'],
  },
};
