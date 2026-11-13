import { Suspense } from 'react';
import UsersSection from '@/components/users/UsersSection';
import Heading from '@/components/ui/headings/Heading';
import Loading from '@/components/ui/Loading';

const UsersPage = () => {
  return (
    <>
      <Heading level={1}>Users</Heading>
      <Suspense fallback={<Loading />}>
        <UsersSection />
      </Suspense>
    </>
  );
}

export default UsersPage;
