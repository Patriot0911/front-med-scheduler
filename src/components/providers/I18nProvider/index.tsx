'use client';

import { useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { z } from 'zod';
import type { II18nProviderProps } from '@/interfaces/i18n/locale';
import { createI18n } from '@/i18n/create-i18n';
import { setGlobalI18n } from '@/i18n/client/i18nRef';
import { setDayjsLocale } from '@/lib/dayjs';

const ZOD_LOCALES = {
  uk: z.locales.uk,
  en: z.locales.en,
};

// the language changes only with a page reload (useLocale), so the instance is created once
const I18nProvider = ({ locale, resources, children, }: II18nProviderProps) => {
  const [i18n] = useState(() => {
    const instance = createI18n(locale, resources);
    setDayjsLocale(locale);
    if (typeof window !== 'undefined') {
      setGlobalI18n(instance);
      z.config(ZOD_LOCALES[locale]());
    }
    return instance;
  });

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};

export default I18nProvider;
