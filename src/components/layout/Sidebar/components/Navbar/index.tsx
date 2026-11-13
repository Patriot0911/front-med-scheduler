'use client';

import useNavbarGroups from '@/hooks/layout/useNavbarGroups';
import { ISidebarSectionProps } from '@/interfaces/layout/sidebar';
import NavGroup from '../NavGroup';

import styles from './styles.module.scss';

const Navbar = ({ isOpen }: ISidebarSectionProps) => {
  const groups = useNavbarGroups();

  return (
    <nav className={styles['nav-container']}>
      {groups.map((group) => (
        <NavGroup
          key={group.key}
          label={group.label}
          items={group.items}
          isOpen={isOpen}
        />
      ))}
    </nav>
  );
}

export default Navbar;
