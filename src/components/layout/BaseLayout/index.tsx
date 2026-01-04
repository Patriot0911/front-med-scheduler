import { PropsWithChildren } from 'react';
import StoreProvider from '../StoreProvider';
import Sidebar from '../Sidebar';
import Header from '../Header';
import Footer from '../Footer';

import styles from './styles.module.scss';

const BaseLayout = ({ children, }: PropsWithChildren) => {
  return (
    <div className={styles.layout}>
      <StoreProvider>
        <Sidebar />
        <div className={styles.content}>
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </StoreProvider>
    </div>
  );
}

export default BaseLayout;
