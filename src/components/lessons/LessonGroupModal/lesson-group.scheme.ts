import { z } from 'zod';

export const lessonGroupSchema = z.object({
  name: z.string().trim().min(3, 'Min 3 chars'),
  note: z.string(),
});

export type TLessonGroupForm = z.infer<typeof lessonGroupSchema>;
