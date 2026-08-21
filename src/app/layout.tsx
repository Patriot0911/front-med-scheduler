import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import BaseLayout from '@/components/layout/BaseLayout';
import { geistMono, geistSans } from '@/fonts/geist';
import { oswald } from '@/fonts/oswald';
import { Providers } from './providers';
import { jost } from '@/fonts/jost';
import { Toaster } from 'react-hot-toast';

import '@/styles/global.scss';

export const metadata: Metadata = {
  title: "Med Scheduler",
};

const RootLayout = ({ children, }: Readonly<PropsWithChildren>) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} ${jost.variable} antialiased`}
      >
        <Providers>
          <BaseLayout>
            {children}
          </BaseLayout>
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
