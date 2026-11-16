import 'server-only';
import type { TLocale, TLocaleResources } from '@/interfaces/i18n/locale';
import { FALLBACK_LOCALE } from '../config';

import enAuth from '../locales/en/auth.json';
import enCommon from '../locales/en/common.json';
import enLessons from '../locales/en/lessons.json';
import enUsers from '../locales/en/users.json';
import enDictionaries from '../locales/en/dictionaries.json';
import enLayout from '../locales/en/layout.json';
import enPermissions from '../locales/en/permissions.json';
import enPublic from '../locales/en/public.json';
import enUi from '../locales/en/ui.json';
import enValidation from '../locales/en/validation.json';

import ukAuth from '../locales/uk/auth.json';
import ukCommon from '../locales/uk/common.json';
import ukLessons from '../locales/uk/lessons.json';
import ukUsers from '../locales/uk/users.json';
import ukDictionaries from '../locales/uk/dictionaries.json';
import ukLayout from '../locales/uk/layout.json';
import ukPermissions from '../locales/uk/permissions.json';
import ukPublic from '../locales/uk/public.json';
import ukUi from '../locales/uk/ui.json';
import ukValidation from '../locales/uk/validation.json';

const en = {
  auth: enAuth,
  common: enCommon,
  lessons: enLessons,
  users: enUsers,
  dictionaries: enDictionaries,
  layout: enLayout,
  permissions: enPermissions,
  public: enPublic,
  ui: enUi,
  validation: enValidation,
};

export type TTranslationResources = typeof en;

// typed by the English keys: a missing Ukrainian key fails the type check
const uk: TTranslationResources = {
  auth: ukAuth,
  common: ukCommon,
  lessons: ukLessons,
  users: ukUsers,
  dictionaries: ukDictionaries,
  layout: ukLayout,
  permissions: ukPermissions,
  public: ukPublic,
  ui: ukUi,
  validation: ukValidation,
};

const RESOURCES: Record<TLocale, TTranslationResources> = { en, uk, };

// server only: the client gets just the active language and the fallback one
export const pickResources = (locale: TLocale): TLocaleResources => ({
  [locale]: RESOURCES[locale],
  [FALLBACK_LOCALE]: RESOURCES[FALLBACK_LOCALE],
});
