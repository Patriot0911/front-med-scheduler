import Link from "next/link";

import styles from './styles.module.scss';
import { FaUserGraduate } from "react-icons/fa";
import { SIDEBAR_ITEMS } from "@/src/configs/sidebar.config";

const Sidebar = () => {
  return (
    <div className={styles['sidebar-wrapper']}>
      <aside className={styles.sidebar}>
        <div className={styles['profile-wrapper']}>
          <FaUserGraduate
            size={48}
            className={styles['profile-icon']}
          />
          <div className={styles['profile-info']}>
            <span>User Name</span>
            <span>Admin</span>
          </div>
        </div>
        <nav>
          <ul>
            {
              SIDEBAR_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))
            }
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export default Sidebar;
