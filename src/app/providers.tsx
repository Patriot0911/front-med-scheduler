'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import type { II18nProviderProps } from '@/interfaces/i18n/locale';
import { queryClient } from '@/lib/query-client';
import I18nProvider from '@/components/providers/I18nProvider';
import StoreProvider from '@/components/providers/StoreProvider';
import AuthProvider from '@/components/providers/AuthProvider';

export function Providers({ locale, resources, children, }: II18nProviderProps) {
  return (
    <I18nProvider locale={locale} resources={resources}>
      <StoreProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </StoreProvider>
    </I18nProvider>
  );
}
