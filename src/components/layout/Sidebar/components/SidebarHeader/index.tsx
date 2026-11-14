'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { ISidebarHeaderProps } from '@/interfaces/layout/sidebar';

import styles from './styles.module.scss';

const SidebarHeader = ({ isOpen }: ISidebarHeaderProps) => {
  const { t, } = useTranslation('layout');

  return (
    <div className={styles['top-wrapper']}>
      <div className={styles['logo-wrapper']}>
        <Image
          alt={t('sidebar.logoAlt')}
          src={'/med-logo.png'}
          width={40}
          height={40}
          className={styles['logo-image']}
          priority
        />
        <AnimatePresence initial={false}>
          {
            isOpen && (
              <motion.span
                className={styles['logo-text']}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                {t('sidebar.brand')}
              </motion.span>
            )
          }
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SidebarHeader;
