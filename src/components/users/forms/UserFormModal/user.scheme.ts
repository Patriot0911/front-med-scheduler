import { validationError } from '@/i18n/client/validation';
import { z } from 'zod';

export const userSchema = z.object({
  fullName: z.string().trim().min(1, validationError('required')),
  email: z.email(validationError('invalidEmail')),
  // create only; '' lets the API generate a random one
  password: z.string()
    .refine((value) => value === '' || value.length >= 8, validationError('minChars', { count: 8, }))
    .refine((value) => value.length <= 128, validationError('maxChars', { count: 128, })),
  roleIds: z.array(z.string()),
  isTeacher: z.boolean(),
  // '' means "not assigned"
  departmentId: z.string(),
  isStudent: z.boolean(),
  studentGroupId: z.string(),
  isGroupMonitor: z.boolean(),
});

export type TUserForm = z.infer<typeof userSchema>;
