import type { PropsWithChildren } from 'react';
import RequireAuth from '@/components/auth/RequireAuth';
import BaseLayout from '@/components/layout/BaseLayout';

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
