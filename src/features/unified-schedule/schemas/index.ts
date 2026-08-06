import type { TranslationType } from '@/shared/types/translation';
import { z } from 'zod';

export const getEventSchema = (t: TranslationType) =>
  z
    .object({
      title: z.string().min(1, { message: t.schedule.validation.titleRequired }),
      description: z.string().optional(),
      context: z.enum(['college', 'work', 'business', 'personal'], {
        message: t.schedule.validation.contextRequired,
      }),
      startDate: z.string().min(1, { message: t.schedule.validation.startDateRequired }),
      endDate: z.string().min(1, { message: t.schedule.validation.endDateRequired }),
      isRecurring: z.boolean(),
      recurringDays: z.array(z.number()).optional(),
      recurringEndDate: z.string().optional(),
    })
    .refine(
      (data) => {
        if (!data.startDate || !data.endDate) return true;
        return new Date(data.startDate) < new Date(data.endDate);
      },
      {
        message: t.schedule.validation.dateOrderInvalid,
        path: ['endDate'],
      }
    );

export type EventFormPayload = z.infer<ReturnType<typeof getEventSchema>>;
