import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import dayjs from '@/lib/dayjs';
import { TCalendarView } from '@/interfaces/ui/calendar';

export const CALENDAR_DATE_PARAM = 'date';
export const CALENDAR_VIEW_PARAM = 'view';

const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const VIEWS: TCalendarView[] = ['day', 'week', 'month'];

const parseDate = (raw: string | null): Date | undefined => {
  if (!raw || !DATE_PATTERN.test(raw)) return undefined;
  const parsed = dayjs(raw);
  return parsed.isValid() && parsed.format(DATE_FORMAT) === raw ? parsed.toDate() : undefined;
};

const parseView = (raw: string | null): TCalendarView | undefined =>
  VIEWS.includes(raw as TCalendarView) ? (raw as TCalendarView) : undefined;

const useCalendarSearchParams = (defaultView: TCalendarView = 'week') => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawDate = searchParams.get(CALENDAR_DATE_PARAM);
  const rawView = searchParams.get(CALENDAR_VIEW_PARAM);

  const date = useMemo(() => parseDate(rawDate) ?? new Date(), [rawDate]);
  const view = parseView(rawView) ?? defaultView;

  const update = useCallback((patch: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => params.set(key, value));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const setDate = useCallback((next: Date) => {
    update({ [CALENDAR_DATE_PARAM]: dayjs(next).format(DATE_FORMAT) });
  }, [update]);

  const setView = useCallback((next: TCalendarView) => {
    update({
      [CALENDAR_VIEW_PARAM]: next,
      [CALENDAR_DATE_PARAM]: dayjs(date).format(DATE_FORMAT),
    });
  }, [update, date]);

  return { date, view, setDate, setView };
};

export default useCalendarSearchParams;
