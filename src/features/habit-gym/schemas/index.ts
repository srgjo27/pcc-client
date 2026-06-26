import { z } from 'zod';

export const habitSchema = z.object({
  name: z.string().min(2, {
    message: 'Habit name must be at least 2 characters.',
  }),
  icon: z.string().min(1, {
    message: 'Please select an icon.',
  }),
  frequency: z.enum(['daily', 'custom']),
  frequencyDays: z.array(z.number().min(0).max(6)),
});
