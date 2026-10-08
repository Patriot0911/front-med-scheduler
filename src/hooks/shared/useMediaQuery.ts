import { useCallback, useSyncExternalStore } from 'react';

const useMediaQuery = (query: string, serverValue = false) => {
  const subscribe = useCallback((listener: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, [query]);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
};

export default useMediaQuery;
