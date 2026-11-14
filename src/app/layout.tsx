import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { geistMono, geistSans } from '@/fonts/geist';
import { oswald } from '@/fonts/oswald';
import { Providers } from './providers';
import { jost } from '@/fonts/jost';
import { Toaster } from 'react-hot-toast';
import { cn } from '@/lib/cn';
import { getRequestLocale, getServerTranslation } from '@/i18n/server';
import { pickResources } from '@/i18n/server/resources';

import '@/styles/global.scss';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerTranslation('public');
  return { title: t('title'), };
};

const RootLayout = async ({ children, }: Readonly<PropsWithChildren>) => {
  const locale = await getRequestLocale();

  return (
    <html lang={locale}>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          oswald.variable,
          jost.variable,
          geistSans.className,
          'antialiased'
        )}
      >
        <Providers locale={locale} resources={pickResources(locale)}>
          {children}
          <Toaster
            toastOptions={{
              position: 'bottom-right',
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
