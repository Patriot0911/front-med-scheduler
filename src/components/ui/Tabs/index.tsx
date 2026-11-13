'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';
import { ITabsProps } from '@/interfaces/ui/tabs';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

const Tabs = <T extends string>({
  items,
  value,
  renderItem,
  onChange,
  variant = 'tiles',
  className,
}: ITabsProps<T>) => {
  const indicatorId = useId();

  return (
    <div role={'tablist'} className={cn(styles[variant], className)}>
      {items.map((item) => {
        const isActive = value === item.key;
        const isDisabled = typeof item.isDisabled === 'function' ? item.isDisabled() : !!item.isDisabled;

        return (
          <button
            key={item.key}
            type={'button'}
            role={'tab'}
            aria-selected={isActive}
            onClick={() => onChange(item.data)}
            className={cn(
              styles['tab-item'],
              isActive && styles.active,
              isDisabled && styles.disabled,
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
            {variant === 'underline' && isActive && (
              <motion.span
                layoutId={indicatorId}
                className={styles.indicator}
                transition={{ type: 'spring', stiffness: 500, damping: 40, }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
