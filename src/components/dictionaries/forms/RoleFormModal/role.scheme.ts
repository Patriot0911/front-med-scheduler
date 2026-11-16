import { validationError } from '@/i18n/client/validation';
import { z } from 'zod';
import { Permission } from '@/interfaces/auth/permission';

export const roleSchema = z.object({
  name: z.string().trim().min(3, validationError('minChars', { count: 3, })),
  rolePriority: z.string()
    .regex(/^\d+$/, validationError('wholeNumberRange', { min: 0, max: 256, }))
    .refine((value) => Number(value) <= 256, validationError('wholeNumberRange', { min: 0, max: 256, })),
  permissions: z.array(z.enum(Permission)),
});

export type TRoleForm = z.infer<typeof roleSchema>;
