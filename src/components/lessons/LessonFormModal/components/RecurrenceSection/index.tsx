'use client';

import { useTranslation } from 'react-i18next';
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

type TPattern = TLessonForm['recurrencePattern'];

const GROUP_MODES: TGroupMode[] = ['new', 'existing'];
const PATTERNS: TPattern[] = ['none', 'daily', 'weekly', 'biweekly', 'custom'];
const HINT_KEYS = {
  none: 'recurrence.hints.none',
  daily: 'recurrence.hints.range',
  weekly: 'recurrence.hints.range',
  biweekly: 'recurrence.hints.range',
  custom: 'recurrence.hints.custom',
} as const satisfies Record<TPattern, string>;

// '0' = Monday … '6' = Sunday, short names in the current dayjs locale
const getWeekdayOptions = (): ISelectOption[] => Array.from({ length: 7, }, (_, index) => ({
  value: String(index),
  label: dayjs().day((index + 1) % 7).format('ddd'),
}));

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
  const { t, } = useTranslation('lessons');
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
          <h3 id={'recurrence-title'} className={styles.title}>{t('recurrence.title')}</h3>
          <p className={styles.description}>
            {t('recurrence.description')}
          </p>
        </div>
        <Button variant={'ghost'} leftIcon={<LuX />} onClick={onRemove}>
          {t('recurrence.remove')}
        </Button>
      </div>

      <Tabs<TGroupMode>
        items={GROUP_MODES.map((key): ITabItem<TGroupMode> => ({ key, data: key, label: t(`recurrence.modes.${key}`), }))}
        value={groupMode.value}
        onChange={groupMode.onChange}
        variant={'tiles'}
        className={styles.modes}
      />

      {groupMode.value === 'new'
        ? (
          <FormInput<TLessonForm>
            name={'groupName'}
            label={t('recurrence.groupName')}
            placeholder={t('recurrence.groupNamePlaceholder')}
            required
            hideErrorMessage
          />
        )
        : (
          <FormSelect<TLessonForm, ISelectOption>
            name={'existingGroupId'}
            label={t('recurrence.group')}
            options={groupOptions}
            placeholder={isLoadingGroups || groupOptions.length ? t('recurrence.pickGroup') : t('recurrence.noOwnGroups')}
            hint={t('recurrence.groupHint')}
            searchable
            required
            hideErrorMessage
          >
            <SelectParts searchPlaceholder={t('recurrence.searchGroup')} />
          </FormSelect>
        )}

      <div className={styles.row}>
        <FormSelect<TLessonForm, ISelectOption>
          name={'recurrencePattern'}
          label={t('recurrence.repeats')}
          options={PATTERNS.map((value) => ({ value, label: t(`recurrence.patterns.${value}`), }))}
          hideErrorMessage
        >
          <SelectParts />
        </FormSelect>
        {hasRange && (
          <FormDateTimeField<TLessonForm>
            name={'recurrenceUntil'}
            label={t('recurrence.until')}
            placeholder={t('recurrence.untilPlaceholder')}
            required
            hideErrorMessage
          />
        )}
      </div>

      {(pattern === 'weekly' || pattern === 'biweekly') && (
        <FormCheckboxGroup<TLessonForm>
          name={'recurrenceWeekdays'}
          label={t('recurrence.on')}
          options={getWeekdayOptions()}
          required
        />
      )}

      <div className={styles.preview}>
        <div className={styles['preview-header']}>
          <span className={styles['preview-title']}>
            {isTooMany
              ? t('recurrence.tooMany', { count: MAX_SERIES_LESSONS, })
              : t('count', { count: dates.length, })}
          </span>
          {!isTooMany && dates.length > 1 && (
            <span className={styles['preview-range']}>
              {dayjs(dates[0]).format('DD MMM')} – {dayjs(dates[dates.length - 1]).format('DD MMM YYYY')}
            </span>
          )}
        </div>
        <span className={styles['preview-hint']}>{t(HINT_KEYS[pattern])}</span>
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
