import { z } from 'zod';
import dayjs from '@/lib/dayjs';
import { buildSeriesDates, MAX_SERIES_LESSONS } from '@/lib/lesson-recurrence';
import { LessonVisibility } from '@/interfaces/lessons/lesson';

interface ILessonSchemaContext {
  /** teacher id → their department, from the teachers dictionary */
  teacherDepartments: Map<string, string | null>;
};

const RECURRENCE_PATTERNS = ['none', 'daily', 'weekly', 'biweekly', 'custom'] as const;
const GROUP_MODES = ['new', 'existing'] as const;

// the author is always among the teachers: the field locks them in
export const createLessonSchema = ({ teacherDepartments, }: ILessonSchemaContext) => z.object({
  name: z.string().trim().min(1, 'Required'),
  start: z.date({ error: 'Required', }),
  duration: z.string()
    .regex(/^\d+$/, 'Whole minutes')
    .refine((value) => Number(value) >= 5, 'Min 5 minutes')
    .refine((value) => Number(value) <= 24 * 60, 'Max 24 hours'),
  teacherIds: z.array(z.string()).min(1, 'At least one teacher'),
  studentGroupIds: z.array(z.string()),
  // '' means no semester
  semesterId: z.string(),
  departmentIds: z.array(z.string()),
  visibility: z.enum(LessonVisibility),
  note: z.string(),
  // the lesson (or a series of them) in a lesson group, see RecurrenceSection
  isRecurring: z.boolean(),
  groupMode: z.enum(GROUP_MODES),
  groupName: z.string(),
  existingGroupId: z.string(),
  recurrencePattern: z.enum(RECURRENCE_PATTERNS),
  recurrenceUntil: z.date().nullable(),
  // '0' = Monday … '6' = Sunday
  recurrenceWeekdays: z.array(z.string()),
  recurrenceDates: z.array(z.date()),
}).superRefine((form, ctx) => {
  // the API accepts only departments of the lesson teachers
  const allowed = new Set(form.teacherIds.map((id) => teacherDepartments.get(id)));
  if (form.departmentIds.some((id) => !allowed.has(id))) {
    ctx.addIssue({ code: 'custom', path: ['departmentIds'], message: 'Only departments of the selected teachers', });
  }

  if (!form.isRecurring) return;
  if (form.groupMode === 'new' && form.groupName.trim().length < 3) {
    ctx.addIssue({ code: 'custom', path: ['groupName'], message: 'Group name: min 3 chars', });
  }
  if (form.groupMode === 'existing' && !form.existingGroupId) {
    ctx.addIssue({ code: 'custom', path: ['existingGroupId'], message: 'Pick one of your lesson groups', });
  }
  // no repeats: the group gets only this lesson
  if (form.recurrencePattern === 'none') return;
  const hasRange = form.recurrencePattern !== 'custom';
  if (hasRange && !form.recurrenceUntil) {
    ctx.addIssue({ code: 'custom', path: ['recurrenceUntil'], message: 'Pick the last day of the series', });
  } else if (hasRange && form.recurrenceUntil && dayjs(form.recurrenceUntil).isBefore(form.start, 'day')) {
    ctx.addIssue({ code: 'custom', path: ['recurrenceUntil'], message: 'The series must end on or after the first lesson', });
  }
  const usesWeekdays = form.recurrencePattern === 'weekly' || form.recurrencePattern === 'biweekly';
  if (usesWeekdays && form.recurrenceWeekdays.length === 0) {
    ctx.addIssue({ code: 'custom', path: ['recurrenceWeekdays'], message: 'Pick at least one weekday', });
    return;
  }
  // on the field that changes the count: the dates for `custom` (no field to light up, the submit names it), else Until
  const count = buildSeriesDates(toSeriesRule(form)).length;
  if (!hasRange && count < 2) {
    ctx.addIssue({ code: 'custom', path: ['recurrenceDates'], message: 'Add at least one more date to the series', });
  } else if (hasRange && form.recurrenceUntil && count > MAX_SERIES_LESSONS) {
    ctx.addIssue({ code: 'custom', path: ['recurrenceUntil'], message: `A series has at most ${MAX_SERIES_LESSONS} lessons: pick an earlier day`, });
  } else if (hasRange && form.recurrenceUntil && count < 2) {
    ctx.addIssue({ code: 'custom', path: ['recurrenceUntil'], message: 'A series needs at least two lessons: pick a later day', });
  }
});

export type TLessonForm = z.infer<ReturnType<typeof createLessonSchema>>;

export const toSeriesRule = (form: Pick<TLessonForm,
  'start' | 'recurrencePattern' | 'recurrenceUntil' | 'recurrenceWeekdays' | 'recurrenceDates'>) => ({
  start: form.start,
  pattern: form.recurrencePattern,
  until: form.recurrenceUntil,
  weekdays: form.recurrenceWeekdays.map(Number),
  customDates: form.recurrenceDates,
});
