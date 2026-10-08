import Link from 'next/link';
import { LuLayoutDashboard } from 'react-icons/lu';

import styles from './styles.module.scss';

const BackToPlatformButton = () => {
  return (
    <Link href="/" className={styles.button}>
      <LuLayoutDashboard className={styles.icon} />
      <span className={styles.label}>Back to platform</span>
    </Link>
  );
};

export default BackToPlatformButton;
