import { validationError } from '@/i18n/client/validation';
import { z } from 'zod';
import dayjs from '@/lib/dayjs';

export const semesterSchema = z.object({
  name: z.string().trim().min(3, validationError('minChars', { count: 3, })),
  // YYYY-MM-DD from <input type="date">
  dateFrom: z.string().min(1, validationError('required')),
  dateTo: z.string().min(1, validationError('required')),
}).refine(
  ({ dateFrom, dateTo, }) => !dateFrom || !dateTo || !dayjs(dateTo).isBefore(dayjs(dateFrom)),
  { ...validationError('notBeforeStart'), path: ['dateTo'], },
);

export type TSemesterForm = z.infer<typeof semesterSchema>;
