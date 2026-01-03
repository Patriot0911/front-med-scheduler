import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { geistMono, geistSans } from '@/fonts/geist';
import BaseLayout from '@/components/layout/BaseLayout';

import '@/styles/global.scss';

export const metadata: Metadata = {
  title: "Med Scheduler",
};

const RootLayout = ({ children, }: Readonly<PropsWithChildren>) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BaseLayout>
          {children}
        </BaseLayout>
      </body>
    </html>
  );
}

export default RootLayout;
