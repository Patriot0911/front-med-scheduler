import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const TAB_PARAM = 'tab';

/** The selected tab, kept in `?<param>=` (`?tab=` by default); falls back to the first available one */
const useTabParam = <T extends string>(availableKeys: readonly T[], param = TAB_PARAM) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get(param) as T | null;
  const tab: T | undefined = rawTab && availableKeys.includes(rawTab)
    ? rawTab
    : availableKeys[0];

  const setTab = useCallback((next: T) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(param, next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false, });
  }, [router, pathname, searchParams, param]);

  return { tab, setTab, };
}

export default useTabParam;
