import { PropsWithChildren } from "react";
import Footer from "./Footer";
import Header from "./Header";

import styles from './styles.module.scss';
import Sidebar from "./Sidebar";

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
