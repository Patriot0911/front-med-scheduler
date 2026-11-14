import 'i18next';
import type { TTranslationResources } from '@/i18n/server/resources';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: TTranslationResources;
  }
}
