import { useQuery } from '@tanstack/react-query';
import { LESSONS_VIEWS } from '@/configs/lessons-views.config';
import { useAppSelector } from '@/hooks/redux';
import { authStatusSelector } from '@/hooks/redux/auth';
import LessonsService, { LessonsQueryKey } from '@/lib/services/lessons.service';
import type { TLessonsSource, TLessonsView } from '@/interfaces/lessons/filters';
import type { ILessonsListParams, ILessonsResponse } from '@/interfaces/lessons/lesson';

const SOURCE_QUERY_KEYS: Record<TLessonsSource, LessonsQueryKey> = {
  list: LessonsQueryKey.List,
  my: LessonsQueryKey.My,
  admin: LessonsQueryKey.Admin,
};

/** Lessons of a view; without page / pageSize the API returns the whole range (calendar) */
const useLessonsQuery = (view: TLessonsView, params: ILessonsListParams) => {
  const authStatus = useAppSelector(authStatusSelector);
  const { source, scope, } = LESSONS_VIEWS[view];

  return useQuery<ILessonsResponse>({
    queryKey: [SOURCE_QUERY_KEYS[source], scope, params],
    queryFn: () => {
      if (source === 'my') return LessonsService.getMyLessons({ ...params, scope, });
      if (source === 'admin') return LessonsService.getAdminLessons(params);
      return LessonsService.getLessons(params);
    },
    // /lessons/list also works for guests; the others wait for the session
    enabled: source === 'list' ? authStatus !== 'init' : authStatus === 'authenticated',
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });
};

export default useLessonsQuery;
