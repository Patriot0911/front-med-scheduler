import 'client-only';
import type { ParseKeys } from 'i18next';
import { getGlobalI18n } from './i18nRef';

// zod calls `error` on every failed check, so the message follows the current language
export const validationError = (key: ParseKeys<'validation'>, options?: { count?: number }) => ({
  error: () => getGlobalI18n().getFixedT(null, 'validation')(key, options ?? {}),
});
