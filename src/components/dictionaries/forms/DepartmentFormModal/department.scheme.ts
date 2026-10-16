import { z } from 'zod';

export const departmentSchema = z.object({
  name: z.string().trim().min(2, 'Min 2 chars'),
  // '' = no head
  headTeacherId: z.string(),
});

export type TDepartmentForm = z.infer<typeof departmentSchema>;
