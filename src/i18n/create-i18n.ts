import { createInstance } from 'i18next';
import type { TLocale, TLocaleResources } from '@/interfaces/i18n/locale';
import { FALLBACK_LOCALE, LOCALES } from './config';

export const createI18n = (locale: TLocale, resources: TLocaleResources) => {
  const instance = createInstance();

  // no initReactI18next: it pulls React context into server components; I18nextProvider passes the instance
  instance.init({
    lng: locale,
    fallbackLng: FALLBACK_LOCALE,
    supportedLngs: LOCALES,
    resources,
    defaultNS: 'common',
    interpolation: { escapeValue: false, },
    initAsync: false,
  });

  return instance;
};
