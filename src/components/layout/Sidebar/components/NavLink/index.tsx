'use client';

import Link from 'next/link';
import { cn } from '@/lib/cn';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux';
import { useUserSelector } from '@/hooks/redux/auth';
import { INavbarItem } from '@/interfaces/layout/sidebar';

import styles from './styles.module.scss';

const NavLink = ({ href, label, icon, exactPath, isAuthenticated, }: INavbarItem) => {
  const userState = useAppSelector(useUserSelector);
  const pathname = usePathname();

  const isActive = exactPath
    ? pathname === href
    : pathname.startsWith(href);

  if (isAuthenticated && !userState) return;

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
