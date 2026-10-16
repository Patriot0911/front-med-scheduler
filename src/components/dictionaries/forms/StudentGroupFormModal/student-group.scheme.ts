import { z } from 'zod';

export const studentGroupSchema = z.object({
  name: z.string().trim().min(3, 'Min 3 chars'),
  studyYear: z.string().trim().min(1, 'Required'),
  tagIds: z.array(z.string()),
});

export type TStudentGroupForm = z.infer<typeof studentGroupSchema>;
