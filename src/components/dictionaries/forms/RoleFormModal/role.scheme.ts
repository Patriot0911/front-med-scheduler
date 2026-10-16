import { z } from 'zod';
import { Permission } from '@/interfaces/auth/permission';

export const roleSchema = z.object({
  name: z.string().trim().min(3, 'Min 3 chars'),
  rolePriority: z.string()
    .regex(/^\d+$/, 'Whole number from 0 to 256')
    .refine((value) => Number(value) <= 256, 'Whole number from 0 to 256'),
  permissions: z.array(z.enum(Permission)),
});

export type TRoleForm = z.infer<typeof roleSchema>;
