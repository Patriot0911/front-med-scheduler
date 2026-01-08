import type { PropsWithChildren } from 'react';
import StoreProvider from './components/StoreProvider';
import QueryProvider from './components/QueryProvider';

const Provider = ({ children }: PropsWithChildren) => {
  return (
    <StoreProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </StoreProvider>
  );
}

export default Provider;
