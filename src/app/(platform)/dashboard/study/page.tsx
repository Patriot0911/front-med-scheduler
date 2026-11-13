import { Suspense } from 'react';
import StudyLessonsSection from '@/components/lessons/StudyLessonsSection';
import Heading from '@/components/ui/headings/Heading';
import Loading from '@/components/ui/Loading';

const StudyPage = () => {
  return (
    <>
      <Heading level={1}>My schedule</Heading>
      <Suspense fallback={<Loading />}>
        <StudyLessonsSection />
      </Suspense>
    </>
  );
}

export default StudyPage;
