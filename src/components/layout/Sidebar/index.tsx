'use client';

import { cn } from '@/lib/cn';
import useSidebarState from '@/hooks/layout/useSidebarState';
import Navbar from './components/Navbar';
import SidebarHeader from './components/SidebarHeader';
import SidebarToggle from './components/SidebarToggle';
import UserSection from './components/UserSection';

import styles from './styles.module.scss';

const Sidebar = () => {
  const { isOpen, isRestored, toggle } = useSidebarState();

  return (
    <div
      className={cn(
        styles['sidebar-wrapper'],
        isOpen && styles['sidebar-open'],
        !isRestored && styles['sidebar-restoring'],
      )}
    >
      <aside className={cn(styles['sidebar'], isOpen && styles['sidebar-open'])}>
        <SidebarHeader isOpen={isOpen} />
        <Navbar isOpen={isOpen} />
        <UserSection isOpen={isOpen} />
      </aside>
      <SidebarToggle isOpen={isOpen} changeOpen={toggle} />
    </div>
  );
}

export default Sidebar;
