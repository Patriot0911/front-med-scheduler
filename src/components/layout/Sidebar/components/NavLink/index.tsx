'use client';

import Link from 'next/link';
import { cn } from '@/lib/cn';
import { usePathname } from 'next/navigation';
import { INavbarItem } from '@/interfaces/layout/sidebar';

import styles from './styles.module.scss';

const NavLink = ({ href, label, icon, exactPath, }: INavbarItem) => {
  const pathname = usePathname();

  const isActive = exactPath
    ? pathname === href
    : pathname.startsWith(href);

  return (
    <li
      key={href}
      className={
        cn(
          styles['nav-item'],
          isActive && styles['active']
        )
      }
    >
      <Link
        aria-current={isActive ? 'page' : undefined}
        href={href}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
}

export default NavLink;
