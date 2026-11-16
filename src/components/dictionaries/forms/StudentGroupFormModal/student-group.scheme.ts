import { validationError } from '@/i18n/client/validation';
import { z } from 'zod';

export const studentGroupSchema = z.object({
  name: z.string().trim().min(3, validationError('minChars', { count: 3, })),
  studyYear: z.string().trim().min(1, validationError('required')),
  tagIds: z.array(z.string()),
});

export type TStudentGroupForm = z.infer<typeof studentGroupSchema>;
