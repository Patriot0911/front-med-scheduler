import WelcomeHero from '@/components/welcome/WelcomeHero';

import styles from './styles.module.scss';

const WelcomePage = () => {
  return (
    <main className={styles.page}>
      <WelcomeHero />
    </main>
  );
};

export default WelcomePage;
