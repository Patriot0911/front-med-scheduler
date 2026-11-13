import type { PropsWithChildren } from 'react';
import RequireAuth from '@/components/auth/RequireAuth';
import BaseLayout from '@/components/layout/BaseLayout';

/** The dashboard (/dashboard/*) is for signed-in users only; guests are sent to the welcome page */
const PlatformLayout = ({ children }: PropsWithChildren) => {
  return (
    <RequireAuth shouldRedirect>
      <BaseLayout>
        {children}
      </BaseLayout>
    </RequireAuth>
  );
}

export default PlatformLayout;
