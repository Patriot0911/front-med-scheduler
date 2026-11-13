import { Suspense } from 'react';
import QuerySyncedCalendar from '@/components/lessons/QuerySyncedCalendar';
import Heading from '@/components/ui/headings/Heading';
import Loading from '@/components/ui/Loading';

const LessonsPage = () => {
  return (
    <>
      <Heading level={1}>All lessons</Heading>
      <Suspense fallback={<Loading />}>
        <QuerySyncedCalendar />
      </Suspense>
    </>
  );
}

export default LessonsPage;
