import { useCallback, useEffect, useState } from 'react';
import usePersistentState from '@/hooks/shared/usePersistentState';
import useMediaQuery from '@/hooks/shared/useMediaQuery';
import { mediaUp } from '@/configs/breakpoints.config';

export const SIDEBAR_STORAGE_KEY = 'med-scheduler:sidebar-open';

const useSidebarState = () => {
  const isDesktop = useMediaQuery(mediaUp('md'));
  const [persistedOpen, setPersistedOpen] = usePersistentState<boolean>(SIDEBAR_STORAGE_KEY, false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    let innerFrame = 0;
    const outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => setIsRestored(true));
    });

    return () => {
      cancelAnimationFrame(outerFrame);
      cancelAnimationFrame(innerFrame);
    };
  }, []);

  const isOpen = isDesktop ? persistedOpen : mobileOpen;

  const setIsOpen = useCallback((next: boolean) => {
    if (isDesktop) setPersistedOpen(next);
    else setMobileOpen(next);
  }, [isDesktop, setPersistedOpen]);

  const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen]);

  return { isOpen, isRestored, setIsOpen, toggle };
};

export default useSidebarState;
