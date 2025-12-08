import { PropsWithChildren } from "react";
import Footer from "./Footer";
import Header from "./Header";

import styles from './styles.module.scss';
import Link from "next/link";

const Layout = ({ children, }: PropsWithChildren) => {
    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <nav>
                    <ul>
                        <li>
                            <Link href={'/'}>test</Link>
                        </li>
                    </ul>
                </nav>
            </aside>
            <div className={styles.content}>
                <Header />
                <main>{children}</main>
                <Footer />
            </div>
        </div>
    );
}

export default Layout;
