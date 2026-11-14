import { Suspense } from 'react';
import UsersSection from '@/components/users/UsersSection';
import { getServerTranslation } from '@/i18n/server';
import Heading from '@/components/ui/headings/Heading';
import Loading from '@/components/ui/Loading';

const UsersPage = async () => {
  const t = await getServerTranslation('layout');

  return (
    <>
      <Heading level={1}>{t('pages.users')}</Heading>
      <Suspense fallback={<Loading />}>
        <UsersSection />
      </Suspense>
    </>
  );
}

export default UsersPage;
