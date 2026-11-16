import dayjs from '@/lib/dayjs';
import type { ILessonGroup } from '@/interfaces/lessons/lesson-group';

export const formatGroupPeriod = ({ firstLessonDate, lastLessonDate, }: ILessonGroup) => (firstLessonDate && lastLessonDate
  ? `${dayjs(firstLessonDate).format('DD.MM.YYYY')} – ${dayjs(lastLessonDate).format('DD.MM.YYYY')}`
  : null);
