import { IDictionaryTabItemProps } from '@/interfaces/dictionaries/dictionary-tab';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

const DictionaryTabItem = ({ icon, title, isActive, }: IDictionaryTabItemProps) => {
  return (
    <span className={cn(styles['tab-item'], isActive && styles['tab-item__active'])}>
      <span className={styles.icon} aria-hidden>{icon}</span>
      <span className={styles.title}>{title}</span>
    </span>
  );
}

export default DictionaryTabItem;
