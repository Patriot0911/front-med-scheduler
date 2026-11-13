import { Suspense } from 'react';
import TeachingLessonsSection from '@/components/lessons/TeachingLessonsSection';
import Heading from '@/components/ui/headings/Heading';
import Loading from '@/components/ui/Loading';

const TeachingPage = () => {
  return (
    <>
      <Heading level={1}>Teaching lessons</Heading>
      <Suspense fallback={<Loading />}>
        <TeachingLessonsSection />
      </Suspense>
    </>
  );
}

export default TeachingPage;
