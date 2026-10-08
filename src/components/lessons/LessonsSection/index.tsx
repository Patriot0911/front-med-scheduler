'use client';

import dynamic from 'next/dynamic';
import Loading from '@/components/ui/Loading';
import { ILessonsCalendarProps } from '@/interfaces/lessons/calendar';

const LessonsCalendar = dynamic(() => import('../LessonsCalendar'), {
  ssr: false,
  loading: () => <Loading />,
});

const LessonsSection = (props: ILessonsCalendarProps) => <LessonsCalendar {...props} />;

export default LessonsSection;
