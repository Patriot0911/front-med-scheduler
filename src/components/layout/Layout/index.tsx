import { Footer, Header, Sidebar } from '../components';
import { PropsWithChildren } from 'react';

import styles from './styles.module.scss';

const Layout = ({ children, }: PropsWithChildren) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
