'use client';

import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';
import { INavGroupProps } from '@/interfaces/layout/sidebar';
import NavLink from '../NavLink';

import styles from './styles.module.scss';

const NavGroup = ({ label, items, isOpen, }: INavGroupProps) => {
  const { t, } = useTranslation('layout');
  const labelId = useId();

  return (
    <section
      className={styles['nav-group']}
      aria-labelledby={label ? labelId : undefined}
    >
      {label && (
        <p
          id={labelId}
          className={cn(styles['group-label'], !isOpen && styles['collapsed'])}
        >
          <span>{t(label)}</span>
        </p>
      )}
      <ul className={styles['nav-list']}>
        {items.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            exactPath={item.exactPath}
            isOpen={isOpen}
          />
        ))}
      </ul>
    </section>
  );
}

export default NavGroup;
