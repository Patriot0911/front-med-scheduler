import { validationError } from '@/i18n/client/validation';
import { z } from 'zod';

export const lessonGroupSchema = z.object({
  name: z.string().trim().min(3, validationError('minChars', { count: 3, })),
  note: z.string(),
});

export type TLessonGroupForm = z.infer<typeof lessonGroupSchema>;
