'use client';

import dynamic from 'next/dynamic';
import Loading from '@/components/ui/Loading';

// Calendar depends on the client's "now" and timezone — render on client only to avoid hydration mismatch
const LessonsCalendar = dynamic(() => import('../LessonsCalendar'), {
  ssr: false,
  loading: () => <Loading />,
});

const LessonsSection = () => <LessonsCalendar />;

export default LessonsSection;
