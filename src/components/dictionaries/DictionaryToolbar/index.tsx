import { LuPlus, LuSearch, LuX } from 'react-icons/lu';
import { IDictionaryToolbarProps } from '@/interfaces/dictionaries/dictionary-tab';
import { cn } from '@/lib/cn';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

import styles from './styles.module.scss';

const DictionaryToolbar = ({ search, onSearchChange, itemName, canManage, onCreate, }: IDictionaryToolbarProps) => {
  return (
    <div className={cn(styles.toolbar, 'fields-compact')}>
      <div className={styles.search}>
        <Input
          name={'dictionary-search'}
          value={search}
          placeholder={'Search by name…'}
          aria-label={'Search by name'}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={search ? <LuX /> : <LuSearch />}
          onIconClick={() => onSearchChange('')}
          hideErrorMessage
        />
      </div>
      {canManage && (
        <Button
          leftIcon={<LuPlus />}
          onClick={onCreate}
          className={styles['action-button']}
        >
          Add {itemName}
        </Button>
      )}
    </div>
  );
}

export default DictionaryToolbar;
