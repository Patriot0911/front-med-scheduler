import { Suspense } from 'react';
import AllLessonsSection from '@/components/lessons/AllLessonsSection';
import Heading from '@/components/ui/headings/Heading';
import Loading from '@/components/ui/Loading';

const LessonsPage = () => {
  return (
    <>
      <Heading level={1}>All lessons</Heading>
      <Suspense fallback={<Loading />}>
        <AllLessonsSection />
      </Suspense>
    </>
  );
}

export default LessonsPage;
