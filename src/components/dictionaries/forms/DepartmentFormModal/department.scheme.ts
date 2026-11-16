import { validationError } from '@/i18n/client/validation';
import { z } from 'zod';

export const departmentSchema = z.object({
  name: z.string().trim().min(2, validationError('minChars', { count: 2, })),
  // '' = no head
  headTeacherId: z.string(),
});

export type TDepartmentForm = z.infer<typeof departmentSchema>;
