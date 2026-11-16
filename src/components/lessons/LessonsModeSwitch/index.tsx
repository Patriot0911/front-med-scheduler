'use client';

import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCalendarDays, LuList } from 'react-icons/lu';
import type { ILessonsModeSwitchProps, TLessonsMode } from '@/interfaces/lessons/filters';
import type { ITabItem } from '@/interfaces/ui/tabs';
import Tabs from '@/components/ui/Tabs';

import styles from './styles.module.scss';

const MODE_ICONS: Record<TLessonsMode, ReactNode> = {
  calendar: <LuCalendarDays />,
  list: <LuList />,
};

const LessonsModeSwitch = ({ value, onChange, }: ILessonsModeSwitchProps) => {
  const { t, } = useTranslation('lessons');
  const modes = (Object.keys(MODE_ICONS) as TLessonsMode[]).map((key): ITabItem<TLessonsMode> => {
    const label = t(`sections.admin.modes.${key}`);
    return { key, data: key, label, render: <span className={styles.item}>{MODE_ICONS[key]}{label}</span>, };
  });

  return (
    <Tabs
      items={modes}
      value={value}
      onChange={onChange}
      variant={'tiles'}
    />
  );
}

export default LessonsModeSwitch;
