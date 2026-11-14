import 'client-only';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { TLocale } from '@/interfaces/i18n/locale';
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, LOCALES } from '@/i18n/config';

// a reload re-renders the server layout with the new language and resets dayjs / zod / cached texts
const useLocale = () => {
  const { i18n, } = useTranslation();
  const locale: TLocale = isLocale(i18n.language) ? i18n.language : DEFAULT_LOCALE;

  const setLocale = useCallback((next: TLocale) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
    window.location.reload();
  }, [locale]);

  const nextLocale = LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length];

  return { locale, nextLocale, setLocale, };
};

export default useLocale;
