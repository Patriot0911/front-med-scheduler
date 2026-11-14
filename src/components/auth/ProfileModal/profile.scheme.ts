import { z } from 'zod';
import { validationError } from '@/i18n/client/validation';

/** `currentPassword` is checked on submit: it is required only when the email changes */
export const profileDataSchema = z.object({
  fullName: z.string().trim().min(1, validationError('required')),
  email: z.email(validationError('invalidEmail')),
  currentPassword: z.string(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, validationError('required')),
  newPassword: z.string()
    .min(8, validationError('minChars', { count: 8, }))
    .max(128, validationError('maxChars', { count: 128, })),
  confirmPassword: z.string(),
})
  .refine((data) => data.confirmPassword === data.newPassword, {
    ...validationError('passwordsMismatch'),
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    ...validationError('passwordMustDiffer'),
    path: ['newPassword'],
  });

export type TProfileDataForm = z.infer<typeof profileDataSchema>;
export type TChangePasswordForm = z.infer<typeof changePasswordSchema>;
