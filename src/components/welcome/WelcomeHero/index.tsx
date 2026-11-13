'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaUserGraduate } from 'react-icons/fa';
import { LuLayoutDashboard } from 'react-icons/lu';
import { useAppSelector } from '@/hooks/redux';
import { authStatusSelector } from '@/hooks/redux/auth';
import AuthModal from '@/components/auth/AuthModal';
import Button from '@/components/ui/Button';

import styles from './styles.module.scss';

const DASHBOARD_PATH = '/dashboard';

const WelcomeHero = () => {
  const router = useRouter();
  const status = useAppSelector(authStatusSelector);
  const [isShownAuthModal, setIsShownAuthModal] = useState(false);

  return (
    <section className={styles.hero}>
      <span className={styles.logo}>
        <Image alt="Scheduler logo" src="/med-logo.png" width={112} height={112} priority />
      </span>
      <h1 className={styles.title}>Med Scheduler</h1>
      <p className={styles.subtitle}>
        Schedule of lessons, lectures, exams and events
      </p>

      <div className={styles.actions}>
        {status === 'authenticated' && (
          <Button leftIcon={<LuLayoutDashboard />} onClick={() => router.push(DASHBOARD_PATH)}>
            Open dashboard
          </Button>
        )}
        {status === 'guest' && (
          <Button leftIcon={<FaUserGraduate />} onClick={() => setIsShownAuthModal(true)}>
            Sign In
          </Button>
        )}
      </div>

      <AuthModal
        isOpen={isShownAuthModal}
        onClose={() => setIsShownAuthModal(false)}
        onAuthenticated={() => router.push(DASHBOARD_PATH)}
      />
    </section>
  );
};

export default WelcomeHero;
