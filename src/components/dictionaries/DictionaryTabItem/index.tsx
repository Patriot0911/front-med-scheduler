import { IDictionaryTabItemProps } from '@/interfaces/dictionaries/dictionary-tab';

import styles from './styles.module.scss';

const DictionaryTabItem = ({ icon, title, }: IDictionaryTabItemProps) => {
  return (
    <div className={styles['tab-item']}>
      {icon} {title}
    </div>
  );
}

export default DictionaryTabItem;
