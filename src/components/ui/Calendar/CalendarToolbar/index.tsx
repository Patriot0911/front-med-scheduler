import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import { ICalendarToolbarProps, TCalendarView } from '@/interfaces/ui/calendar';
import { ITabItem } from '@/interfaces/ui/tabs';

import styles from './styles.module.scss';

const VIEW_LABELS: Record<TCalendarView, string> = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
};

const CalendarToolbar = ({ label, view, views, onNavigate, onViewChange }: ICalendarToolbarProps) => {
  const tabsItems: ITabItem<TCalendarView>[] = views.map((v) => ({
    key: v,
    data: v,
    label: VIEW_LABELS[v],
  }));

  return (
    <div className={styles.toolbar}>
      <div className={styles.navigation}>
        <Button
          variant="secondary"
          className={styles['today-btn']}
          onClick={() => onNavigate('TODAY')}
        >
          Today
        </Button>
        <button
          type="button"
          aria-label="Previous"
          className={styles['arrow-btn']}
          onClick={() => onNavigate('PREV')}
        >
          <LuChevronLeft />
        </button>
        <button
          type="button"
          aria-label="Next"
          className={styles['arrow-btn']}
          onClick={() => onNavigate('NEXT')}
        >
          <LuChevronRight />
        </button>
        <span className={styles.label}>{label}</span>
      </div>

      <Tabs<TCalendarView>
        items={tabsItems}
        value={view}
        onChange={onViewChange}
      />
    </div>
  );
};

export default CalendarToolbar;
