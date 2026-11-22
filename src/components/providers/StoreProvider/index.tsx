'use client';

import { AppStore, makeStore } from '@/store';
import { setGlobalStore } from '@/store/storeRef';
import { PropsWithChildren, useState, } from 'react'
import { Provider, } from 'react-redux'

const StoreProvider = ({ children, }: PropsWithChildren )  => {
  const [store] = useState<AppStore>(makeStore);
  setGlobalStore(store);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

export default StoreProvider;