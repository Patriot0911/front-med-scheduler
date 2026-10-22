import { z } from 'zod';

export const profileDataSchema = z.object({
  fullName: z.string().trim().min(1, 'Required'),
  email: z.email('Invalid email'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(8, 'Min 8 chars').max(128, 'Max 128 chars'),
  confirmPassword: z.string(),
})
  .refine((data) => data.confirmPassword === data.newPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'Must differ from the current password',
    path: ['newPassword'],
  });

export type TProfileDataForm = z.infer<typeof profileDataSchema>;
export type TChangePasswordForm = z.infer<typeof changePasswordSchema>;
