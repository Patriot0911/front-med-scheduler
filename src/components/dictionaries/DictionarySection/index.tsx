'use client';

import { useMemo } from 'react';
import { dictionariesConfig } from '@/configs/dictionaries.config';
import { TDictionaryKey } from '@/interfaces/dictionaries/tables';
import { ITabItem } from '@/interfaces/ui/tabs';
import usePermissions from '@/hooks/queries/auth/usePermissions';
import useTabParam from '@/hooks/shared/useTabParam';
import Tabs from '@/components/ui/Tabs';
import Loading from '@/components/ui/Loading';
import DictionaryTabItem from '../DictionaryTabItem';
import DictionaryTabPanel from '../DictionaryTabPanel';

import styles from './styles.module.scss';

const ALL_DICTIONARY_KEYS = Object.keys(dictionariesConfig) as TDictionaryKey[];

/** Tabs of the dictionaries the user may read; the selected one is kept in `?tab=`. */
const DictionarySection = () => {
  const { hasAny, isReady, } = usePermissions();
  const availableKeys = useMemo(
    () => ALL_DICTIONARY_KEYS.filter((key) => hasAny(dictionariesConfig[key].readPermissions)),
    [hasAny],
  );
  const { tab, setTab, } = useTabParam(availableKeys);

  if (!isReady) {
    return <Loading />;
  }

  if (!tab) {
    return (
      <p className={styles.empty}>
        You don&apos;t have access to any dictionary. Ask an administrator for permissions.
      </p>
    );
  }

  const tabsItems: ITabItem<TDictionaryKey>[] = availableKeys.map((key) => ({
    key,
    data: key,
    label: dictionariesConfig[key].title,
  }));

  return (
    <section className={styles.section}>
      <Tabs<TDictionaryKey>
        className={styles.tabs}
        items={tabsItems}
        value={tab}
        renderItem={(item) => (
          <DictionaryTabItem
            title={item.label}
            icon={dictionariesConfig[item.data].icon}
            isActive={item.key === tab}
          />
        )}
        onChange={setTab}
      />

      <DictionaryTabPanel
        key={tab}
        dictionaryKey={tab}
        canManage={hasAny(dictionariesConfig[tab].managePermissions)}
      />
    </section>
  );
}

export default DictionarySection;
