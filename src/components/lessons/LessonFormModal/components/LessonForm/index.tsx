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
import useCreateLessonMutation from '@/hooks/mutations/lessons/useCreateLessonMutation';
import useCreateLessonSeriesMutation from '@/hooks/mutations/lessons/useCreateLessonSeriesMutation';
import useAddLessonsToGroupMutation from '@/hooks/mutations/lessons/useAddLessonsToGroupMutation';
import { LessonVisibility, type ICreateLessonPayload, type ICreateLessonSeriesPayload } from '@/interfaces/lessons/lesson';
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

const SelectParts = () => (
  <>
    <FormSelect.Selected<ISelectOption>>
      {(option) => option.label}
    </FormSelect.Selected>
    <FormSelect.Area>
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

// mounted only while the modal is open, so every opening starts from the draft
const LessonForm = ({ draft, isDepartmentLesson = false, onClose, }: ILessonFormProps) => {
  const { data: me, } = useMeQuery();
  const teacherId = me?.teacher?.id ?? '';
  const departmentId = me?.teacher?.departmentId ?? null;

  const { data: teachers, } = useTeachersDictionaryQuery();
  const { data: studentGroups, } = useStudentGroupsDictionaryQuery();
  const { data: semesters, } = useSemestersDictionaryQuery();
  const { data: departments, } = useDepartmentsDictionaryQuery();

  const teacherDepartments = useMemo(
    () => new Map((teachers ?? []).map((teacher) => [teacher.id, teacher.departmentId])),
    [teachers],
  );
  const schema = useMemo(() => createLessonSchema({ teacherDepartments, }), [teacherDepartments]);
  const teacherOptions = useMemo(
    () => (teachers ?? []).map(({ id, name, }) => ({ value: id, label: id === teacherId ? `${name} (you)` : name, })),
    [teachers, teacherId],
  );
  const methods = useForm<TLessonForm>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      start: draft.start,
      duration: String(draft.duration),
      teacherIds: teacherId ? [teacherId] : [],
      studentGroupIds: [],
      semesterId: '',
      departmentIds: isDepartmentLesson && departmentId ? [departmentId] : [],
      visibility: LessonVisibility.All,
      note: '',
      isRecurring: false,
      groupMode: 'new',
      groupName: '',
      existingGroupId: '',
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
  const mutations = [mutation, seriesMutation, addToGroupMutation];
  const isPending = mutations.some(({ isPending: pending, }) => pending);
  const isLocked = isPending || mutations.some(({ isSuccess, }) => isSuccess);

  // without a group: one lesson; a new group comes with its lessons; an existing one gets the lessons
  const submit = (form: TLessonForm) => {
    if (!form.isRecurring) {
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
        title={'New lesson'}
        description={'You can edit it later, as can the other teachers of the lesson.'}
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
              lockedValues={teacherId ? [teacherId] : []}
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

          {isRecurring
            ? <RecurrenceSection dates={seriesDates} onRemove={stopSeries} />
            : (
              <Button variant={'secondary'} leftIcon={<LuLayers />} onClick={startSeries} className={styles['series-button']}>
                Add to a lesson group
              </Button>
            )}
        </fieldset>
      </Modal.Content>
      <Modal.Footer>
        <Button className={'flex-1'} variant={'secondary'} onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button type={'submit'} className={'flex-1'} variant={'primary'} isLoading={isPending} disabled={isLocked}>
          {isRecurring && seriesDates.length > 1 ? `Create ${seriesDates.length} lessons` : 'Create lesson'}
        </Button>
      </Modal.Footer>
    </Modal.FormBody>
  );
}

export default LessonForm;
