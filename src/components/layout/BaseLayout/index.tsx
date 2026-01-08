import { PropsWithChildren } from 'react';
import Provider from '../Provider';
import Sidebar from '../Sidebar';
import Header from '../Header';
import Footer from '../Footer';

import styles from './styles.module.scss';

const BaseLayout = ({ children, }: PropsWithChildren) => {
  return (
    <div className={styles.layout}>
      <Provider>
        <Sidebar />
        <div className={styles.content}>
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </Provider>
    </div>
  );
}

export default BaseLayout;
