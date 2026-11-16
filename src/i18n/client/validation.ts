import 'client-only';
import type { ParseKeys } from 'i18next';
import { getGlobalI18n } from './i18nRef';

type TValidationOptions = Record<string, string | number>;

// for messages built at validation time, e.g. in superRefine
export const validationMessage = (key: ParseKeys<'validation'>, options?: TValidationOptions) =>
  getGlobalI18n().getFixedT(null, 'validation')(key, options ?? {});

// zod calls `error` on every failed check, so the message follows the current language
export const validationError = (key: ParseKeys<'validation'>, options?: TValidationOptions) => ({
  error: () => validationMessage(key, options),
});
