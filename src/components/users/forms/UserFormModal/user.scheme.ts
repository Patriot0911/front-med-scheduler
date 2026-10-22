import { z } from 'zod';

export const userSchema = z.object({
  fullName: z.string().trim().min(1, 'Required'),
  email: z.email('Invalid email'),
  // create only; '' lets the API generate a random one
  password: z.string()
    .refine((value) => value === '' || value.length >= 8, 'Min 8 chars')
    .refine((value) => value.length <= 128, 'Max 128 chars'),
  roleIds: z.array(z.string()),
  isTeacher: z.boolean(),
  // '' means "not assigned"
  departmentId: z.string(),
  isStudent: z.boolean(),
  studentGroupId: z.string(),
  isGroupMonitor: z.boolean(),
});

export type TUserForm = z.infer<typeof userSchema>;
