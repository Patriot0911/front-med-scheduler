import { SIDEBAR_HOME, SIDEBAR_GROUPS } from '@/src/configs/sidebar.config';
import NavLink from '../NavLink';

import styles from './styles.module.scss';

const Navbar = () => {
  return (
    <nav>
      <div className={styles['group-wrapper']}>
        <NavLink
          {...SIDEBAR_HOME}
        />
      </div>
      {
        SIDEBAR_GROUPS.map(
          (group) => (
            <div key={group.label} className={styles['group-wrapper']}>
              <label className={styles['group-label']}>{group.label}</label>
              <ul className={styles['nav-list']}>
                {
                  group.items.map(
                    (item) => (
                      <NavLink
                        {...item}
                        key={item.href}
                      />
                    )
                  )
                }
              </ul>
            </div>
          )
        )
      }
    </nav>
  );
}

export default Navbar;
