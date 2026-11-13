import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { EMPTY_LESSONS_FILTERS } from '@/configs/lessons-views.config';
import { LessonVisibility } from '@/interfaces/lessons/lesson';
import type { ILessonsFilters, TLessonsFilterKey } from '@/interfaces/lessons/filters';

export const LESSONS_SEARCH_PARAM = 'search';

const VISIBILITY_VALUES = Object.values(LessonVisibility) as string[];

const readFilters = (params: URLSearchParams, keys: readonly TLessonsFilterKey[]): ILessonsFilters => {
  const filters: ILessonsFilters = { ...EMPTY_LESSONS_FILTERS, };
  for (const key of keys) {
    if (key === 'visibility') {
      const visibility = params.get(key) ?? '';
      filters.visibility = VISIBILITY_VALUES.includes(visibility) ? visibility as LessonVisibility : '';
    } else {
      filters[key] = params.getAll(key);
    }
  }
  return filters;
};

/**
 * Search and filters of a lessons view, kept in the URL (`?search=&teacherIds=a&teacherIds=b`).
 * Only the view's keys are read and written, so the filters of other views stay in the URL untouched.
 */
const useLessonsFiltersParams = (keys: readonly TLessonsFilterKey[]) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => readFilters(searchParams, keys), [searchParams, keys]);
  const search = searchParams.get(LESSONS_SEARCH_PARAM) ?? '';

  const replaceParams = useCallback((update: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    update(params);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false, });
  }, [router, pathname, searchParams]);

  const setFilters = useCallback((next: ILessonsFilters) => replaceParams((params) => {
    for (const key of keys) {
      params.delete(key);
      if (key === 'visibility') {
        if (next.visibility) params.set(key, next.visibility);
      } else {
        next[key].forEach((value) => params.append(key, value));
      }
    }
  }), [replaceParams, keys]);

  const setSearch = useCallback((next: string) => replaceParams((params) => {
    if (next) {
      params.set(LESSONS_SEARCH_PARAM, next);
    } else {
      params.delete(LESSONS_SEARCH_PARAM);
    }
  }), [replaceParams]);

  return { filters, search, setFilters, setSearch, };
};

export default useLessonsFiltersParams;
