'use client';

import { useTranslation } from 'react-i18next';
import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import useTabParam from '@/hooks/shared/useTabParam';
import Loading from '@/components/ui/Loading';
import Tabs from '@/components/ui/Tabs';
import type { ITabItem } from '@/interfaces/ui/tabs';
import type { TTeachingLessonsTab } from '@/interfaces/lessons/sections';
import LessonsBrowser from '../LessonsBrowser';

import styles from './styles.module.scss';

const TEACHER_TABS: TTeachingLessonsTab[] = ['teaching'];
const HEAD_TABS: TTeachingLessonsTab[] = ['teaching', 'department'];

const TeachingLessonsSection = () => {
  const { t, } = useTranslation('lessons');
  const { data: user, } = useMeQuery();
  const isHead = !!user?.teacher?.headOfDepartmentId;
  const { tab = 'teaching', setTab, } = useTabParam(isHead ? HEAD_TABS : TEACHER_TABS);

  if (!user) {
    return <Loading />;
  }

  if (!user.teacher) {
    return (
      <p className={styles.empty}>
        {t('sections.teaching.noProfile')}
      </p>
    );
  }

  return (
    <section className={styles.section}>
      {isHead && (
        <Tabs
          items={HEAD_TABS.map((key): ITabItem<TTeachingLessonsTab> => ({ key, data: key, label: t(`sections.teaching.tabs.${key}`), }))}
          value={tab}
          onChange={setTab}
          variant={'underline'}
        />
      )}
      <p className={styles.description}>
        {t(`sections.teaching.description.${tab}`)}
      </p>
      <LessonsBrowser view={tab} />
    </section>
  );
}

export default TeachingLessonsSection;
