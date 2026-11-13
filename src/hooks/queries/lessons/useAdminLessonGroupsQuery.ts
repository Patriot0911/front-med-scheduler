import { useQuery } from '@tanstack/react-query';
import LessonGroupsService, { LessonGroupsQueryKey } from '@/lib/services/lesson-groups.service';

const useAdminLessonGroupsQuery = (page: number, pageSize: number, search: string) => {
  return useQuery({
    queryKey: [LessonGroupsQueryKey.AdminList, page, search],
    queryFn: () => LessonGroupsService.getAdminLessonGroups({
      page,
      pageSize,
      ...(search ? { search, } : {}),
    }),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });
}

export default useAdminLessonGroupsQuery;
