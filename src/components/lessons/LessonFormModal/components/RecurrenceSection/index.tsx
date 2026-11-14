'use client';

import { useEffect } from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import { LuX } from 'react-icons/lu';
import dayjs from '@/lib/dayjs';
import { MAX_SERIES_LESSONS } from '@/lib/lesson-recurrence';
import useMyLessonGroupsQuery from '@/hooks/queries/lessons/useMyLessonGroupsQuery';
import type { ISelectOption } from '@/interfaces/ui/selectors';
import type { ITabItem } from '@/interfaces/ui/tabs';
import type { IRecurrenceSectionProps } from '@/interfaces/lessons/modal';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import MultiMonthCalendar from '@/components/ui/MultiMonthCalendar';
import FormInput from '@/components/ui/FormInput';
import FormSelect from '@/components/ui/FormSelect';
import FormCheckboxGroup from '@/components/ui/FormCheckboxGroup';
import FormDateTimeField from '@/components/ui/FormDateTimeField';
import type { TLessonForm } from '../LessonForm/lesson.scheme';

import styles from './styles.module.scss';

type TGroupMode = TLessonForm['groupMode'];

const GROUP_MODES: ITabItem<TGroupMode>[] = [
  { key: 'new', data: 'new', label: 'New group', },
  { key: 'existing', data: 'existing', label: 'Existing group', },
];
const PATTERN_OPTIONS: ISelectOption[] = [
  { value: 'none', label: 'Doesn’t repeat (only this lesson)', },
  { value: 'daily', label: 'Every day', },
  { value: 'weekly', label: 'Every week, on chosen days', },
  { value: 'biweekly', label: 'Every two weeks, on chosen days', },
  { value: 'custom', label: 'Custom dates', },
];
const WEEKDAY_OPTIONS: ISelectOption[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  .map((label, index) => ({ value: String(index), label, }));

const HINTS: Record<TLessonForm['recurrencePattern'], string> = {
  none: 'Only this lesson goes into the group; you can add more lessons to it later.',
  daily: 'Days from the rule above. Switch to Custom dates to pick them by hand.',
  weekly: 'Days from the rule above. Switch to Custom dates to pick them by hand.',
  biweekly: 'Days from the rule above. Switch to Custom dates to pick them by hand.',
  custom: 'Click days to add or remove lessons. The first one is fixed at «Starts at».',
};

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

/**
 * The lesson in a lesson group: a new one or one of the teacher's own, with the lesson repeated or not.
 * The dates come from the rule and are shown before creating.
 */
const RecurrenceSection = ({ dates, onRemove, }: IRecurrenceSectionProps) => {
  const { control, setValue, clearErrors, } = useFormContext<TLessonForm>();
  const [start, pattern, customDates] = useWatch({ control, name: ['start', 'recurrencePattern', 'recurrenceDates'], });
  const { field: groupMode, } = useController({ control, name: 'groupMode', });
  const { data: myGroups, isLoading: isLoadingGroups, } = useMyLessonGroupsQuery(groupMode.value === 'existing');
  const groupOptions = (myGroups ?? []).map(({ id, name, }) => ({ value: id, label: name, }));

  // fields of the previous choice may be hidden now: their errors would show up again later out of context
  useEffect(() => {
    clearErrors(['recurrencePattern', 'recurrenceUntil', 'recurrenceWeekdays', 'recurrenceDates']);
  }, [pattern, clearErrors]);
  useEffect(() => {
    clearErrors(['groupName', 'existingGroupId']);
  }, [groupMode.value, clearErrors]);

  const isTooMany = dates.length > MAX_SERIES_LESSONS;
  const isCustom = pattern === 'custom';
  const hasRange = pattern === 'daily' || pattern === 'weekly' || pattern === 'biweekly';
  const includesFirst = dates.some((date) => dayjs(date).isSame(start, 'day'));

  // custom dates: a click adds or removes a day; the first lesson stays
  const toggleCustomDate = (day: Date) => {
    if (dayjs(day).isSame(start, 'day')) return;
    const isPicked = customDates.some((picked) => dayjs(picked).isSame(day, 'day'));
    setValue(
      'recurrenceDates',
      isPicked ? customDates.filter((picked) => !dayjs(picked).isSame(day, 'day')) : [...customDates, day],
      { shouldValidate: true, },
    );
  };

  return (
    <section className={styles.section} aria-labelledby={'recurrence-title'}>
      <div className={styles.header}>
        <div>
          <h3 id={'recurrence-title'} className={styles.title}>Lesson group</h3>
          <p className={styles.description}>
            Lessons that belong together, e.g. a course. Every lesson gets the fields above; the first one is at «Starts at».
          </p>
        </div>
        <Button variant={'ghost'} leftIcon={<LuX />} onClick={onRemove}>
          Remove
        </Button>
      </div>

      <Tabs<TGroupMode>
        items={GROUP_MODES}
        value={groupMode.value}
        onChange={groupMode.onChange}
        variant={'tiles'}
        className={styles.modes}
      />

      {groupMode.value === 'new'
        ? (
          <FormInput<TLessonForm>
            name={'groupName'}
            label={'Group name'}
            placeholder={'e.g. Anatomy, lectures'}
            required
            hideErrorMessage
          />
        )
        : (
          <FormSelect<TLessonForm, ISelectOption>
            name={'existingGroupId'}
            label={'Group'}
            options={groupOptions}
            placeholder={isLoadingGroups || groupOptions.length ? 'Pick one of your groups' : 'You have no lesson groups yet'}
            hint={'Groups you created'}
            searchable
            required
            hideErrorMessage
          >
            <SelectParts searchPlaceholder={'Search group…'} />
          </FormSelect>
        )}

      <div className={styles.row}>
        <FormSelect<TLessonForm, ISelectOption>
          name={'recurrencePattern'}
          label={'Repeats'}
          options={PATTERN_OPTIONS}
          hideErrorMessage
        >
          <SelectParts />
        </FormSelect>
        {hasRange && (
          <FormDateTimeField<TLessonForm>
            name={'recurrenceUntil'}
            label={'Until'}
            placeholder={'Last day of the series'}
            required
            hideErrorMessage
          />
        )}
      </div>

      {(pattern === 'weekly' || pattern === 'biweekly') && (
        <FormCheckboxGroup<TLessonForm>
          name={'recurrenceWeekdays'}
          label={'On'}
          options={WEEKDAY_OPTIONS}
          required
        />
      )}

      <div className={styles.preview}>
        <div className={styles['preview-header']}>
          <span className={styles['preview-title']}>
            {isTooMany
              ? `More than ${MAX_SERIES_LESSONS} lessons: shorten the range`
              : `${dates.length} ${dates.length === 1 ? 'lesson' : 'lessons'}`}
          </span>
          {!isTooMany && dates.length > 1 && (
            <span className={styles['preview-range']}>
              {dayjs(dates[0]).format('DD MMM')} – {dayjs(dates[dates.length - 1]).format('DD MMM YYYY')}
            </span>
          )}
        </div>
        <span className={styles['preview-hint']}>{HINTS[pattern]}</span>
        <MultiMonthCalendar
          key={dayjs(start).format('YYYY-MM')}
          selected={isTooMany ? [] : dates}
          lockedDates={includesFirst ? [start] : []}
          minDate={start}
          initialMonth={start}
          onToggle={isCustom ? toggleCustomDate : undefined}
        />
      </div>
    </section>
  );
}

export default RecurrenceSection;
