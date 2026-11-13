'use client';

import { LuCalendarDays, LuList } from 'react-icons/lu';
import type { ILessonsModeSwitchProps, TLessonsMode } from '@/interfaces/lessons/filters';
import type { ITabItem } from '@/interfaces/ui/tabs';
import Tabs from '@/components/ui/Tabs';

import styles from './styles.module.scss';

const MODES: ITabItem<TLessonsMode>[] = [
  { key: 'calendar', data: 'calendar', label: 'Calendar', render: <span className={styles.item}><LuCalendarDays />Calendar</span>, },
  { key: 'list', data: 'list', label: 'List', render: <span className={styles.item}><LuList />List</span>, },
];

const LessonsModeSwitch = ({ value, onChange, }: ILessonsModeSwitchProps) => {
  return (
    <Tabs
      items={MODES}
      value={value}
      onChange={onChange}
      variant={'tiles'}
    />
  );
}

export default LessonsModeSwitch;
