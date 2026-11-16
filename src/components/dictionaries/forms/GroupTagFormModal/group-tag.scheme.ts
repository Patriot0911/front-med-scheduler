import { validationError } from '@/i18n/client/validation';
import { z } from 'zod';

export const groupTagSchema = z.object({
  name: z.string().trim().min(3, validationError('minChars', { count: 3, })),
});

export type TGroupTagForm = z.infer<typeof groupTagSchema>;
