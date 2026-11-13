'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppSelector } from '@/hooks/redux';
import { authStatusSelector } from '@/hooks/redux/auth';
import Loading from '@/components/ui/Loading';

import { IRequireAuthProps } from '@/interfaces/auth/auth-guard';

import styles from './styles.module.scss';

const RequireAuth = ({ children, fallback, redirectPath, shouldRedirect = false }: IRequireAuthProps) => {
  const status = useAppSelector(authStatusSelector);
  const router = useRouter();
  const redirectTo = redirectPath || '/';
  const isReady = status !== 'init' && status !== 'guest';

  useEffect(() => {
    if (status === 'guest' && shouldRedirect) {
      router.replace(redirectTo);
    }
  }, [status, router, shouldRedirect, redirectPath]);

  return (
    <>
      {/* {isReady && children} */}
      {children}
      <AnimatePresence>
        {!isReady && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {status === 'init' ? <Loading /> : fallback}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default RequireAuth;
