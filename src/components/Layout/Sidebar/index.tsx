import Link from "next/link";

import styles from './styles.module.scss';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul>
          <li>
            <Link href={'/'}>test</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
