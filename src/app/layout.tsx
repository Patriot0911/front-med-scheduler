import { geistMono, geistSans } from '../fonts/geist';
import Layout from '../components/layout/Layout';
import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

import "./globals.css";

export const metadata: Metadata = {
  title: "Med Scheduler",
};

const RootLayout = ({ children, }: Readonly<PropsWithChildren>) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}

export default RootLayout;
