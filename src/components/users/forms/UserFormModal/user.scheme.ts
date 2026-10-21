import { z } from 'zod';

export const userSchema = z.object({
  fullName: z.string().trim().min(1, 'Required'),
  email: z.email('Invalid email'),
  roleIds: z.array(z.string()),
  isTeacher: z.boolean(),
  // '' means "not assigned"
  departmentId: z.string(),
  isStudent: z.boolean(),
  studentGroupId: z.string(),
  isGroupMonitor: z.boolean(),
});

export type TUserForm = z.infer<typeof userSchema>;
