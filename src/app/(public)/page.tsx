import WelcomeHero from '@/components/welcome/WelcomeHero';

import styles from './styles.module.scss';

/** Open to everyone, signed in or not; the dashboard lives at /dashboard */
const WelcomePage = () => {
  return (
    <main className={styles.page}>
      <WelcomeHero />
    </main>
  );
};

export default WelcomePage;
