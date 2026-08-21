'use client';

import Link from 'next/link';
import { cn } from '@/lib/cn';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux';
import { INavLinkProps } from '@/interfaces/layout/sidebar';
import { authStatusSelector } from '@/hooks/redux/auth';

import styles from './styles.module.scss';

const NavLink = ({ href, label, icon, exactPath, isAuthenticated, isOpen, }: INavLinkProps) => {
  const authStatus = useAppSelector(authStatusSelector);
  const pathname = usePathname();

  const isActive = exactPath
    ? pathname === href
    : pathname.startsWith(href);

  if (isAuthenticated && authStatus !== 'authenticated') return;

  return (
    <li
      key={href}
      className={
        cn(
          styles['nav-item'],
          isActive && styles['active'],
          !isOpen && styles['collapsed']
        )
      }
    >
      <Link
        aria-current={isActive ? 'page' : undefined}
        title={label}
        href={href}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
}

export default NavLink;
