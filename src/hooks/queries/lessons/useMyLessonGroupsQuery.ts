import { useQuery } from '@tanstack/react-query';
import LessonGroupsService, { LessonGroupsQueryKey } from '@/lib/services/lesson-groups.service';

const useMyLessonGroupsQuery = (enabled = true) => {
  return useQuery({
    queryKey: [LessonGroupsQueryKey.My],
    queryFn: LessonGroupsService.getMyLessonGroups,
    staleTime: 60 * 1000,
    enabled,
  });
}

export default useMyLessonGroupsQuery;
