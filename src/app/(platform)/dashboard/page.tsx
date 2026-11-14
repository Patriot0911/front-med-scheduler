import { getServerTranslation } from '@/i18n/server';
import Heading from '@/components/ui/headings/Heading';

const OverviewPage = async () => {
  const t = await getServerTranslation('layout');

  return (
    <Heading level={1}>{t('pages.overview')}</Heading>
  );
}

export default OverviewPage;
