import { Suspense } from 'react';
import AdminLessonsSection from '@/components/lessons/AdminLessonsSection';
import Heading from '@/components/ui/headings/Heading';
import Loading from '@/components/ui/Loading';

const AdminLessonsPage = () => {
  return (
    <>
      <Heading level={1}>Lessons management</Heading>
      <Suspense fallback={<Loading />}>
        <AdminLessonsSection />
      </Suspense>
    </>
  );
}

export default AdminLessonsPage;
