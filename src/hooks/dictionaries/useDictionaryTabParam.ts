import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { TDictionaryKey } from '@/interfaces/dictionaries/tables';

export const DICTIONARY_TAB_PARAM = 'tab';

/** The selected dictionary tab, kept in `?tab=` so it survives reloads and can be linked to. */
const useDictionaryTabParam = (availableKeys: TDictionaryKey[]) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get(DICTIONARY_TAB_PARAM) as TDictionaryKey | null;
  const tab: TDictionaryKey | undefined = rawTab && availableKeys.includes(rawTab)
    ? rawTab
    : availableKeys[0];

  const setTab = useCallback((next: TDictionaryKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(DICTIONARY_TAB_PARAM, next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  return { tab, setTab };
}

export default useDictionaryTabParam;
