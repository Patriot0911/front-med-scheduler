import { ITabsProps } from '@/interfaces/ui/tabs';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

const Tabs = <T extends string>({ items, value, renderItem, onChange, className }: ITabsProps<T>) => (
  <div className={cn(styles.tabs, className)}>
    {items.map((item) => (
      <button
        key={item.key}
        type='button'
        onClick={() => onChange(item.data)}
        className={cn(
          styles['tab-item'],
          value === item.key && styles.active,
          (typeof item.isDisabled === 'function'
            ? item.isDisabled()
            : !!item.isDisabled)
          && styles.disabled,
        )}
      >
        {
          item.render
            ? (typeof item.render === 'function' ? item.render(item.data) : item.render)
            : (
              renderItem
                ? renderItem(item)
                : item.label
            )
        }
      </button>
    ))}
  </div>
);

export default Tabs;
