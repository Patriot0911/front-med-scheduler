import { useMemo } from 'react';
import useDepartmentsDictionaryQuery from '@/hooks/queries/dictionaries/useDepartmentsDictionaryQuery';
import useGroupTagsDictionaryQuery from '@/hooks/queries/dictionaries/useGroupTagsDictionaryQuery';
import useLessonGroupsDictionaryQuery from '@/hooks/queries/dictionaries/useLessonGroupsDictionaryQuery';
import useSemestersDictionaryQuery from '@/hooks/queries/dictionaries/useSemestersDictionaryQuery';
import useStudentGroupsDictionaryQuery from '@/hooks/queries/dictionaries/useStudentGroupsDictionaryQuery';
import useTeachersDictionaryQuery from '@/hooks/queries/dictionaries/useTeachersDictionaryQuery';
import type { IDictionaryItem } from '@/interfaces/dictionaries/dictionary-items';
import type { TLessonsFilterKey, TLessonsListFilterKey } from '@/interfaces/lessons/filters';
import type { ISelectOption } from '@/interfaces/ui/selectors';

const toOptions = (items: IDictionaryItem[] | undefined): ISelectOption[] =>
  (items ?? []).map(({ id, name, }) => ({ value: id, label: name, }));

/** Select options of the given filters; dictionaries load only for the filters in use */
const useLessonsFilterOptions = (keys: readonly TLessonsFilterKey[], enabled = true) => {
  const isUsed = (key: TLessonsListFilterKey) => enabled && keys.includes(key);

  const { data: lessonGroups, } = useLessonGroupsDictionaryQuery(isUsed('lessonGroupIds'));
  const { data: teachers, } = useTeachersDictionaryQuery(isUsed('teacherIds'));
  const { data: studentGroups, } = useStudentGroupsDictionaryQuery(isUsed('studentGroupIds'));
  const { data: groupTags, } = useGroupTagsDictionaryQuery(isUsed('groupTagIds'));
  const { data: departments, } = useDepartmentsDictionaryQuery(isUsed('departmentIds'));
  const { data: semesters, } = useSemestersDictionaryQuery(isUsed('semesterIds'));

  return useMemo((): Record<TLessonsListFilterKey, ISelectOption[]> => ({
    lessonGroupIds: toOptions(lessonGroups),
    teacherIds: toOptions(teachers),
    studentGroupIds: toOptions(studentGroups),
    groupTagIds: toOptions(groupTags),
    departmentIds: toOptions(departments),
    semesterIds: toOptions(semesters),
  }), [lessonGroups, teachers, studentGroups, groupTags, departments, semesters]);
};

export default useLessonsFilterOptions;
