import type { ILessonsFilters, TLessonsFilterKey, TLessonsListFilterKey } from '@/interfaces/lessons/filters';
import type { ILessonsListParams } from '@/interfaces/lessons/lesson';

const LIST_FILTER_KEYS: TLessonsListFilterKey[] = [
  'lessonGroupIds', 'teacherIds', 'studentGroupIds', 'groupTagIds', 'departmentIds', 'semesterIds',
];

const isActive = (filters: ILessonsFilters, key: TLessonsFilterKey) =>
  key === 'visibility' ? !!filters.visibility : filters[key].length > 0;

export const countActiveFilters = (filters: ILessonsFilters, keys: readonly TLessonsFilterKey[]) =>
  keys.filter((key) => isActive(filters, key)).length;

// selection order does not matter
export const isSameFilters = (a: ILessonsFilters, b: ILessonsFilters, keys: readonly TLessonsFilterKey[]) =>
  keys.every((key) => {
    if (key === 'visibility') return a.visibility === b.visibility;
    return a[key].length === b[key].length && a[key].every((value) => b[key].includes(value));
  });

/** Query params of the lessons endpoints: empty filters are left out */
export const toLessonsParams = (filters: ILessonsFilters, search: string): ILessonsListParams => {
  const params: ILessonsListParams = {};
  if (search) params.search = search;
  if (filters.visibility) params.visibility = filters.visibility;
  for (const key of LIST_FILTER_KEYS) {
    if (filters[key].length) params[key] = filters[key];
  }
  return params;
};
