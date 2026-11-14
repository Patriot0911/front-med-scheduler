import type { TLocale } from '@/interfaces/i18n/locale';

export const LOCALES: TLocale[] = ['uk', 'en'];

export const DEFAULT_LOCALE: TLocale = 'uk';

// the language the keys are written in; a missing translation falls back to it
export const FALLBACK_LOCALE: TLocale = 'en';

export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const LOCALE_NAMES: Record<TLocale, string> = {
  uk: 'Українська',
  en: 'English',
};

export const isLocale = (value: unknown): value is TLocale => LOCALES.includes(value as TLocale);
