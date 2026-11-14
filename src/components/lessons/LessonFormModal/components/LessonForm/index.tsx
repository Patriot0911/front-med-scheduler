'use client';

import { useEffect, useMemo } from 'react';
import { LuLayers } from 'react-icons/lu';
import dayjs from '@/lib/dayjs';
import { buildSeriesDates } from '@/lib/lesson-recurrence';
import { useForm, useWatch, type FieldErrors } from 'react-hook-form';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import useTeachersDictionaryQuery from '@/hooks/queries/dictionaries/useTeachersDictionaryQuery';
import useStudentGroupsDictionaryQuery from '@/hooks/queries/dictionaries/useStudentGroupsDictionaryQuery';
import useSemestersDictionaryQuery from '@/hooks/queries/dictionaries/useSemestersDictionaryQuery';
import useDepartmentsDictionaryQuery from '@/hooks/queries/dictionaries/useDepartmentsDictionaryQuery';
import useLessonGroupsDictionaryQuery from '@/hooks/queries/dictionaries/useLessonGroupsDictionaryQuery';
import useMyLessonGroupsQuery from '@/hooks/queries/lessons/useMyLessonGroupsQuery';
import useCreateLessonMutation from '@/hooks/mutations/lessons/useCreateLessonMutation';
import useCreateLessonSeriesMutation from '@/hooks/mutations/lessons/useCreateLessonSeriesMutation';
import useAddLessonsToGroupMutation from '@/hooks/mutations/lessons/useAddLessonsToGroupMutation';
import useEditLessonMutation from '@/hooks/mutations/lessons/useEditLessonMutation';
import { LessonVisibility, type ICreateLessonPayload, type ICreateLessonSeriesPayload, type IEditLessonPayload, type ILesson } from '@/interfaces/lessons/lesson';
import { getLessonStart, nextHourLessonDraft } from '@/lib/lessons-calendar';
import type { ILessonFormProps } from '@/interfaces/lessons/modal';
import type { IDictionaryItem } from '@/interfaces/dictionaries/dictionary-items';
import type { ISelectOption } from '@/interfaces/ui/selectors';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import FormDateTimeField from '@/components/ui/FormDateTimeField';
import FormSelect from '@/components/ui/FormSelect';
import FormMultiSelect from '@/components/ui/FormMultiSelect';
import FormTextarea from '@/components/ui/FormTextarea';
import RecurrenceSection from '../RecurrenceSection';
import { createLessonSchema, toSeriesRule, type TLessonForm } from './lesson.scheme';

import styles from './styles.module.scss';

const VISIBILITY_OPTIONS: ISelectOption[] = [
  { value: LessonVisibility.All, label: 'Public: anyone can see it', },
  { value: LessonVisibility.Involved, label: 'Participants only', },
];
const NO_SEMESTER_OPTION: ISelectOption = { value: '', label: 'No semester', };
const NO_GROUP_OPTION: ISelectOption = { value: '', label: 'No group', };

const toOptions = (items: IDictionaryItem[] | undefined): ISelectOption[] =>
  (items ?? []).map(({ id, name, }) => ({ value: id, label: name, }));

// what every lesson gets, one or a series
const toLessonTemplate = (form: TLessonForm): ICreateLessonSeriesPayload['lesson'] => ({
  name: form.name.trim(),
  duration: Number(form.duration),
  teacherIds: form.teacherIds,
  studentGroupIds: form.studentGroupIds,
  semesterId: form.semesterId || null,
  departmentIds: form.departmentIds,
  visibility: form.visibility,
  ...(form.note.trim() ? { note: form.note.trim(), } : {}),
});

const toPayload = (form: TLessonForm): ICreateLessonPayload => ({
  ...toLessonTemplate(form),
  date: form.start.toISOString(),
});

const toSeriesPayload = (form: TLessonForm, dates: Date[]): ICreateLessonSeriesPayload => ({
  lessonGroup: { name: form.groupName.trim(), },
  lesson: toLessonTemplate(form),
  dates: dates.map((date) => date.toISOString()),
});

const SelectParts = ({ searchPlaceholder, }: { searchPlaceholder?: string }) => (
  <>
    <FormSelect.Selected<ISelectOption>>
      {(option) => option.label}
    </FormSelect.Selected>
    <FormSelect.Area>
      {searchPlaceholder && <FormSelect.Search placeholder={searchPlaceholder} />}
      <FormSelect.Option<ISelectOption>>
        {(option) => option.label}
      </FormSelect.Option>
    </FormSelect.Area>
  </>
);

// fields show no error text (they only turn red), so an invalid submit names the first problem
const FIELDS_ORDER: (keyof TLessonForm)[] = [
  'name', 'start', 'duration', 'teacherIds', 'studentGroupIds', 'semesterId', 'visibility', 'departmentIds', 'note',
  'groupName', 'existingGroupId', 'recurrencePattern', 'recurrenceUntil', 'recurrenceWeekdays', 'recurrenceDates',
];
const SERIES_WEEKS = 4;

const showFirstError = (errors: FieldErrors<TLessonForm>) => {
  const field = FIELDS_ORDER.find((key) => errors[key]?.message);
  if (field) toast.error(String(errors[field]?.message));
};

/** Every field of the lesson; the start goes to `delayedDate` for a moved lesson, the note may be cleared */
const toEditPayload = (form: TLessonForm, lesson: ILesson): IEditLessonPayload => ({
  ...toLessonTemplate(form),
  note: form.note.trim(),
  lessonGroupId: form.lessonGroupId || null,
  [lesson.delayedDate ? 'delayedDate' : 'date']: form.start.toISOString(),
});

const toFormLesson = (lesson: ILesson) => ({
  name: lesson.name,
  start: getLessonStart(lesson).toDate(),
  duration: String(lesson.duration),
  teacherIds: lesson.teacherIds,
  studentGroupIds: lesson.studentGroupIds,
  semesterId: lesson.semesterId ?? '',
  departmentIds: lesson.departmentIds,
  visibility: lesson.visibility,
  note: lesson.note ?? '',
  lessonGroupId: lesson.lessonGroupId ?? '',
});

// mounted only while the modal is open, so every opening starts from the draft or the lesson
const LessonForm = ({ draft, lesson, isDepartmentLesson = false, source = 'my', onClose, }: ILessonFormProps) => {
  const { data: me, } = useMeQuery();
  const teacherId = me?.teacher?.id ?? '';
  const departmentId = me?.teacher?.departmentId ?? null;
  const isEdit = !!lesson;
  const isAdmin = source === 'admin';
  // a teacher of the lesson stays one; the admin panel and a head editing a lesson they don't teach lock nobody
  const lockedTeacherIds = teacherId && !isAdmin && (!lesson || lesson.teacherIds.includes(teacherId)) ? [teacherId] : [];

  const { data: teachers, } = useTeachersDictionaryQuery();
  const { data: studentGroups, } = useStudentGroupsDictionaryQuery();
  const { data: semesters, } = useSemestersDictionaryQuery();
  const { data: departments, } = useDepartmentsDictionaryQuery();
  // editing: the teacher's own groups (the admin panel: all of them), plus the lesson's current one so it shows
  const { data: myGroups, } = useMyLessonGroupsQuery(isEdit && !isAdmin);
  const { data: allGroups, } = useLessonGroupsDictionaryQuery(isEdit && isAdmin);
  const groupOptions = useMemo(() => {
    const groups = (isAdmin ? allGroups : myGroups) ?? [];
    const current = lesson?.lessonGroupId && lesson.lessonGroupName && !groups.some(({ id, }) => id === lesson.lessonGroupId)
      ? [{ id: lesson.lessonGroupId, name: lesson.lessonGroupName, }]
      : [];
    return [NO_GROUP_OPTION, ...toOptions([...current, ...groups])];
  }, [isAdmin, allGroups, myGroups, lesson]);

  const teacherDepartments = useMemo(
    () => new Map((teachers ?? []).map((teacher) => [teacher.id, teacher.departmentId])),
    [teachers],
  );
  const schema = useMemo(
    () => createLessonSchema({ teacherDepartments, keptDepartmentIds: lesson?.departmentIds, restrictDepartments: !isAdmin, }),
    [teacherDepartments, lesson, isAdmin],
  );
  const teacherOptions = useMemo(
    () => (teachers ?? []).map(({ id, name, }) => ({ value: id, label: id === teacherId ? `${name} (you)` : name, })),
    [teachers, teacherId],
  );
  const methods = useForm<TLessonForm>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      ...(lesson
        ? toFormLesson(lesson)
        : {
          name: '',
          start: (draft ?? nextHourLessonDraft()).start,
          duration: String((draft ?? nextHourLessonDraft()).duration),
          teacherIds: lockedTeacherIds,
          studentGroupIds: [],
          semesterId: '',
          departmentIds: isDepartmentLesson && departmentId ? [departmentId] : [],
          visibility: LessonVisibility.All,
          note: '',
        }),
      isRecurring: false,
      groupMode: 'new',
      groupName: '',
      existingGroupId: '',
      lessonGroupId: '',
      recurrencePattern: 'weekly',
      recurrenceUntil: null,
      recurrenceWeekdays: [],
      recurrenceDates: [],
    },
  });

  // departments of the selected teachers, plus the selected ones so an invalid choice stays visible with its error
  const [selectedTeacherIds, selectedDepartmentIds] = useWatch({ control: methods.control, name: ['teacherIds', 'departmentIds'], });
  const departmentOptions = useMemo(() => {
    const ids = new Set([
      ...selectedTeacherIds.map((id) => teacherDepartments.get(id)).filter((id): id is string => !!id),
      ...selectedDepartmentIds,
    ]);
    return (departments ?? []).filter(({ id, }) => ids.has(id)).map(({ id, name, }) => ({ value: id, label: name, }));
  }, [selectedTeacherIds, selectedDepartmentIds, teacherDepartments, departments]);

  const [isRecurring, name, start, pattern, until, weekdays, customDates] = useWatch({
    control: methods.control,
    name: ['isRecurring', 'name', 'start', 'recurrencePattern', 'recurrenceUntil', 'recurrenceWeekdays', 'recurrenceDates'],
  });

  // the group is named after the lesson until the teacher renames it
  useEffect(() => {
    if (isRecurring && !methods.getFieldState('groupName').isDirty) {
      methods.setValue('groupName', name.trim());
    }
  }, [isRecurring, name, methods]);
  const seriesDates = useMemo(() => isRecurring && start
    ? buildSeriesDates(toSeriesRule({
      start, recurrencePattern: pattern, recurrenceUntil: until, recurrenceWeekdays: weekdays, recurrenceDates: customDates,
    }))
    : [], [isRecurring, start, pattern, until, weekdays, customDates]);

  // a weekly series on the first lesson's weekday for a month, named after the lesson: a starting point to adjust
  const startSeries = () => {
    const { name: lessonName, start: first, } = methods.getValues();
    methods.setValue('isRecurring', true);
    methods.resetField('groupName', { defaultValue: lessonName.trim(), });
    methods.setValue('recurrenceWeekdays', [String((dayjs(first).day() + 6) % 7)]);
    methods.setValue('recurrenceUntil', dayjs(first).add(SERIES_WEEKS, 'week').toDate());
  };
  const stopSeries = () => {
    methods.setValue('isRecurring', false);
    methods.clearErrors(['groupName', 'existingGroupId', 'recurrencePattern', 'recurrenceUntil', 'recurrenceWeekdays', 'recurrenceDates']);
  };

  const mutation = useCreateLessonMutation(onClose);
  const seriesMutation = useCreateLessonSeriesMutation(onClose);
  const addToGroupMutation = useAddLessonsToGroupMutation(onClose);
  const editMutation = useEditLessonMutation(source, onClose);
  const mutations = [mutation, seriesMutation, addToGroupMutation, editMutation];
  const isPending = mutations.some(({ isPending: pending, }) => pending);
  const isLocked = isPending || mutations.some(({ isSuccess, }) => isSuccess);

  // without a group: one lesson; a new group comes with its lessons; an existing one gets the lessons
  const submit = (form: TLessonForm) => {
    if (lesson) {
      editMutation.mutate({ lessonId: lesson.id, payload: toEditPayload(form, lesson), });
    } else if (!form.isRecurring) {
      mutation.mutate(toPayload(form));
    } else if (form.groupMode === 'new') {
      seriesMutation.mutate(toSeriesPayload(form, seriesDates));
    } else {
      addToGroupMutation.mutate({
        lessonGroupId: form.existingGroupId,
        payload: { lesson: toLessonTemplate(form), dates: seriesDates.map((date) => date.toISOString()), },
      });
    }
  };

  return (
    <Modal.FormBody
      methods={methods}
      onSubmit={methods.handleSubmit(submit, showFirstError)}
    >
      <Modal.Header
        title={isEdit ? 'Edit lesson' : 'New lesson'}
        description={isEdit
          ? lesson.lessonGroupName ?? 'Changes apply to this lesson only.'
          : 'You can edit it later, as can the other teachers of the lesson.'}
      />
      <Modal.Content>
        <fieldset className={styles.fields} disabled={isLocked}>
          <FormInput<TLessonForm>
            name={'name'}
            hideErrorMessage
            label={'Name'}
            placeholder={'e.g. Anatomy: upper limb'}
            required
          />

          <div className={styles.row}>
            <FormDateTimeField<TLessonForm> name={'start'} label={'Starts at'} withTime required hideErrorMessage />
            <FormInput<TLessonForm> name={'duration'} label={'Minutes'} type={'number'} min={5} step={5} required hideErrorMessage />
          </div>

          <div className={styles.row}>
            <FormMultiSelect<TLessonForm, ISelectOption>
              name={'teacherIds'}
              hideErrorMessage
              label={'Teachers'}
              options={teacherOptions}
              lockedValues={lockedTeacherIds}
              placeholder={'Select teachers'}
              searchPlaceholder={'Search teacher…'}
              searchable
            />
            <FormMultiSelect<TLessonForm, ISelectOption>
              name={'studentGroupIds'}
              hideErrorMessage
              label={'Student groups'}
              options={toOptions(studentGroups)}
              placeholder={'No groups'}
              searchPlaceholder={'Search group…'}
              searchable
            />
          </div>

          <div className={styles.row}>
            <FormSelect<TLessonForm, ISelectOption>
              name={'semesterId'}
              hideErrorMessage
              label={'Semester'}
              options={[NO_SEMESTER_OPTION, ...toOptions(semesters)]}
              placeholder={'No semester'}
            >
              <SelectParts />
            </FormSelect>
            <FormSelect<TLessonForm, ISelectOption>
              name={'visibility'}
              hideErrorMessage
              label={'Visibility'}
              options={VISIBILITY_OPTIONS}
            >
              <SelectParts />
            </FormSelect>
          </div>

          <FormMultiSelect<TLessonForm, ISelectOption>
            name={'departmentIds'}
            hideErrorMessage
            label={'Departments'}
            options={departmentOptions}
            placeholder={departmentOptions.length ? 'No departments' : 'Teachers have no departments'}
            searchPlaceholder={'Search department…'}
            hint={'Departments of the selected teachers; their heads can edit the lesson'}
            searchable
          />

          <FormTextarea<TLessonForm>
            name={'note'}
            hideErrorMessage
            label={'Note'}
            placeholder={'What to bring, where to meet…'}
            rows={3}
            maxRows={8}
          />

          {isEdit && (
            <FormSelect<TLessonForm, ISelectOption>
              name={'lessonGroupId'}
              hideErrorMessage
              label={'Lesson group'}
              options={groupOptions}
              placeholder={'No group'}
              hint={isAdmin ? undefined : 'Your groups; «No group» takes the lesson out of its group'}
              searchable
            >
              <SelectParts searchPlaceholder={'Search group…'} />
            </FormSelect>
          )}

          {!isEdit && (isRecurring
            ? <RecurrenceSection dates={seriesDates} onRemove={stopSeries} />
            : (
              <Button variant={'secondary'} leftIcon={<LuLayers />} onClick={startSeries} className={styles['series-button']}>
                Add to a lesson group
              </Button>
            ))}
        </fieldset>
      </Modal.Content>
      <Modal.Footer>
        <Button className={'flex-1'} variant={'secondary'} onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button type={'submit'} className={'flex-1'} variant={'primary'} isLoading={isPending} disabled={isLocked}>
          {isEdit ? 'Save changes' : isRecurring && seriesDates.length > 1 ? `Create ${seriesDates.length} lessons` : 'Create lesson'}
        </Button>
      </Modal.Footer>
    </Modal.FormBody>
  );
}

export default LessonForm;
