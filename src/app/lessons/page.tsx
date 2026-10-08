import RequireAuth from '@/components/auth/RequireAuth';
import BaseLayout from '@/components/layout/BaseLayout';
import LessonsSection from '@/components/lessons/LessonsSection';
import Heading from '@/components/ui/headings/Heading';

const LessonsPage = () => {
  return (
    <RequireAuth shouldRedirect>
      <BaseLayout>
        <Heading level={1}>Lessons</Heading>
        <LessonsSection />
      </BaseLayout>
    </RequireAuth>
  );
}

export default LessonsPage;
