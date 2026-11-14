import 'server-only';
import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import type { TLocale, TNamespace } from '@/interfaces/i18n/locale';
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE } from '../config';
import { createI18n } from '../create-i18n';
import { pickResources } from './resources';

const matchAcceptLanguage = (header: string | null): TLocale | undefined => {
  if (!header) return undefined;

  return header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.find((param) => param.trim().startsWith('q='));
      return { language: tag.split('-')[0].toLowerCase(), q: q ? Number(q.trim().slice(2)) : 1, };
    })
    .sort((a, b) => b.q - a.q)
    .map(({ language, }) => language)
    .find(isLocale);
};

export const getRequestLocale = cache(async (): Promise<TLocale> => {
  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;

  return matchAcceptLanguage((await headers()).get('accept-language')) ?? DEFAULT_LOCALE;
});

const getServerI18n = cache(async () => {
  const locale = await getRequestLocale();
  return createI18n(locale, pickResources(locale));
});

export const getServerTranslation = async <Ns extends TNamespace>(ns: Ns) => {
  const i18n = await getServerI18n();
  return i18n.getFixedT(null, ns);
};
