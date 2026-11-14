import type { PropsWithChildren } from 'react';
import type { TTranslationResources } from '@/i18n/server/resources';

export type TLocale = 'uk' | 'en';

export type TNamespace = keyof TTranslationResources;

export type TLocaleResources = Partial<Record<TLocale, TTranslationResources>>;

export interface II18nProviderProps extends PropsWithChildren {
  locale: TLocale;
  resources: TLocaleResources;
};

export interface ILanguageSwitchProps {
  className?: string;
};
