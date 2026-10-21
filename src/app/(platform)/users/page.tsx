import { Suspense } from 'react';
import RequireAuth from '@/components/auth/RequireAuth';
import UsersSection from '@/components/users/UsersSection';
import Heading from '@/components/ui/headings/Heading';
import Loading from '@/components/ui/Loading';

const UsersPage = () => {
  return (
    <RequireAuth shouldRedirect>
      <Heading level={1}>Users</Heading>
      <Suspense fallback={<Loading />}>
        <UsersSection />
      </Suspense>
    </RequireAuth>
  );
}

export default UsersPage;
