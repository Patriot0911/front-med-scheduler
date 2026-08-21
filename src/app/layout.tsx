import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { geistMono, geistSans } from '@/fonts/geist';
import { oswald } from '@/fonts/oswald';
import { Providers } from './providers';
import { sans } from '@/fonts/sans';
import { nightshade } from '@/fonts/nightshade';
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
        className={`${geistSans.variable} ${sans.variable} ${nightshade.variable} ${geistSans.className} antialiased`}
      >
        <Providers>
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
