import dayjs from 'dayjs';
import type { TLocale } from '@/interfaces/i18n/locale';
import { DEFAULT_LOCALE } from '@/i18n/config';

import 'dayjs/locale/en-gb';
import 'dayjs/locale/uk';

export const DAYJS_LOCALES: Record<TLocale, string> = {
  uk: 'uk',
  en: 'en-gb',
};

export const setDayjsLocale = (locale: TLocale) => {
  dayjs.locale(DAYJS_LOCALES[locale]);
};

setDayjsLocale(DEFAULT_LOCALE);

export default dayjs;
