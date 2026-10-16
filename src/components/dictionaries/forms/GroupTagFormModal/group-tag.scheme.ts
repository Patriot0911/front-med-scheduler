import { z } from 'zod';

export const groupTagSchema = z.object({
  name: z.string().trim().min(3, 'Min 3 chars'),
});

export type TGroupTagForm = z.infer<typeof groupTagSchema>;
