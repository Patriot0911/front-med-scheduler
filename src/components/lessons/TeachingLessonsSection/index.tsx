'use client';

import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import useTabParam from '@/hooks/shared/useTabParam';
import Loading from '@/components/ui/Loading';
import Tabs from '@/components/ui/Tabs';
import type { ITabItem } from '@/interfaces/ui/tabs';
import type { TTeachingLessonsTab } from '@/interfaces/lessons/sections';
import LessonsBrowser from '../LessonsBrowser';

import styles from './styles.module.scss';

const TABS: ITabItem<TTeachingLessonsTab>[] = [
  { key: 'teaching', data: 'teaching', label: 'Teaching', },
  { key: 'department', data: 'department', label: 'Department', },
];

const DESCRIPTIONS: Record<TTeachingLessonsTab, string> = {
  teaching: 'Lessons you teach, on your own or together with other teachers.',
  department: 'All lessons of the department you head.',
};

const TEACHER_TABS: TTeachingLessonsTab[] = ['teaching'];
const HEAD_TABS: TTeachingLessonsTab[] = ['teaching', 'department'];

const TeachingLessonsSection = () => {
  const { data: user, } = useMeQuery();
  const isHead = !!user?.teacher?.headOfDepartmentId;
  const { tab = 'teaching', setTab, } = useTabParam(isHead ? HEAD_TABS : TEACHER_TABS);

  if (!user) {
    return <Loading />;
  }

  if (!user.teacher) {
    return (
      <p className={styles.empty}>
        You don&apos;t have a teacher profile. Ask an administrator to add one.
      </p>
    );
  }

  return (
    <section className={styles.section}>
      {isHead && (
        <Tabs
          items={TABS}
          value={tab}
          onChange={setTab}
          variant={'underline'}
        />
      )}
      <p className={styles.description}>
        {DESCRIPTIONS[tab]}
      </p>
      <LessonsBrowser view={tab} />
    </section>
  );
}

export default TeachingLessonsSection;
