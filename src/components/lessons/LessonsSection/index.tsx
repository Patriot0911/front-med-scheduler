'use client';

import dynamic from 'next/dynamic';
import Loading from '@/components/ui/Loading';

const LessonsCalendar = dynamic(() => import('../LessonsCalendar'), {
  ssr: false,
  loading: () => <Loading />,
});

const LessonsSection = () => <LessonsCalendar />;

export default LessonsSection;
