import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const TAB_PARAM = 'tab';

/** The selected tab, kept in `?tab=`; falls back to the first available one */
const useTabParam = <T extends string>(availableKeys: readonly T[]) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get(TAB_PARAM) as T | null;
  const tab: T | undefined = rawTab && availableKeys.includes(rawTab)
    ? rawTab
    : availableKeys[0];

  const setTab = useCallback((next: T) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(TAB_PARAM, next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false, });
  }, [router, pathname, searchParams]);

  return { tab, setTab, };
}

export default useTabParam;
