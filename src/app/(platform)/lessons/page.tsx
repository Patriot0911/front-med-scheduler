import { Suspense } from 'react';
import RequireAuth from '@/components/auth/RequireAuth';
import QuerySyncedCalendar from '@/components/lessons/QuerySyncedCalendar';
import Heading from '@/components/ui/headings/Heading';
import Loading from '@/components/ui/Loading';

const LessonsPage = () => {
  return (
    <RequireAuth shouldRedirect>
      <Heading level={1}>Lessons</Heading>
      <Suspense fallback={<Loading />}>
        <QuerySyncedCalendar />
      </Suspense>
    </RequireAuth>
  );
}

export default LessonsPage;
