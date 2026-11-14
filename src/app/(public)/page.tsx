import WelcomeHero from '@/components/welcome/WelcomeHero';
import LanguageSwitch from '@/components/layout/LanguageSwitch';

import styles from './styles.module.scss';

const WelcomePage = () => {
  return (
    <main className={styles.page}>
      <LanguageSwitch />
      <WelcomeHero />
    </main>
  );
};

export default WelcomePage;
