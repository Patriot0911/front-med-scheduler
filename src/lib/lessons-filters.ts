import type { ILessonsFilters, TLessonsFilterKey } from '@/interfaces/lessons/filters';

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
