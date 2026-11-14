import 'client-only';
import i18next, { type i18n } from 'i18next';

let _i18n: i18n | undefined;

export const setGlobalI18n = (instance: i18n) => {
  _i18n = instance;
};

// for code outside React (zod messages, error fallbacks); set only in the browser
export const getGlobalI18n = (): i18n => _i18n ?? i18next;
