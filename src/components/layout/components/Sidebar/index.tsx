'use client';

import { useState } from 'react';
import { cn } from '@/src/lib/cn';
import Navbar from './components/Navbar';
import SidebarHeader from './components/SidebarHeader';
import UserSection from './components/UserSection';

import styles from './styles.module.scss';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className={cn(styles['sidebar-wrapper'], isOpen && styles['sidebar-open'])}>
      <aside className={cn(styles['sidebar'], isOpen && styles['sidebar-open'])}>
        <SidebarHeader
          isOpen={isOpen}
          changeOpen={() => setIsOpen((state) => !state)}
        />
        <Navbar />
        <UserSection />
      </aside>
    </div>
  );
}

export default Sidebar;
