'use client';

import { AppStore, makeStore } from '@/store';
import { setGlobalStore } from '@/store/storeRef';
import { PropsWithChildren, useRef, } from 'react'
import { Provider, } from 'react-redux'

const StoreProvider = ({ children, }: PropsWithChildren )  => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    setGlobalStore(storeRef.current);
  }

  return (
    <Provider store={storeRef.current}>
      {children}
    </Provider>
  );
}

export default StoreProvider;