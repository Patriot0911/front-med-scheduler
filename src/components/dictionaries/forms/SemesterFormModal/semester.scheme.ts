import { z } from 'zod';
import dayjs from 'dayjs';

export const semesterSchema = z.object({
  name: z.string().trim().min(3, 'Min 3 chars'),
  // YYYY-MM-DD from <input type="date">
  dateFrom: z.string().min(1, 'Required'),
  dateTo: z.string().min(1, 'Required'),
}).refine(
  ({ dateFrom, dateTo, }) => !dateFrom || !dateTo || !dayjs(dateTo).isBefore(dayjs(dateFrom)),
  { message: 'Must not be earlier than the start date', path: ['dateTo'], },
);

export type TSemesterForm = z.infer<typeof semesterSchema>;
