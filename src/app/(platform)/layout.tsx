import type { PropsWithChildren } from 'react';
import BaseLayout from '@/components/layout/BaseLayout';

const PlatformLayout = ({ children }: PropsWithChildren) => {
  return (
    <BaseLayout>
      {children}
    </BaseLayout>
  );
}

export default PlatformLayout;
