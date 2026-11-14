import { z } from 'zod';
import { validationError } from '@/i18n/client/validation';

export const loginSchema = z.object({
  email: z.email(validationError('invalidEmail')),
  password: z.string().min(6, validationError('minChars', { count: 6, })),
});

export type TLoginForm = z.infer<typeof loginSchema>;
