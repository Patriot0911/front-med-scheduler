import { useQuery } from '@tanstack/react-query';
import LessonGroupsService, { LessonGroupsQueryKey } from '@/lib/services/lesson-groups.service';
import type { TLessonGroupsSource } from '@/interfaces/lessons/lesson-group';

const SOURCES = {
  admin: { key: LessonGroupsQueryKey.AdminList, fetch: LessonGroupsService.getAdminLessonGroups, },
  usable: { key: LessonGroupsQueryKey.UsableList, fetch: LessonGroupsService.getUsableLessonGroups, },
} satisfies Record<TLessonGroupsSource, unknown>;

const useLessonGroupsQuery = (source: TLessonGroupsSource, page: number, pageSize: number, search: string) => {
  const { key, fetch, } = SOURCES[source];
  return useQuery({
    queryKey: [key, page, search],
    queryFn: () => fetch({
      page,
      pageSize,
      ...(search ? { search, } : {}),
    }),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });
}

export default useLessonGroupsQuery;
