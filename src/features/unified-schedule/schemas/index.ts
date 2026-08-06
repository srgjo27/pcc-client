import { z } from "zod";

export const eventsParamsSchema = z.object({
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  context: z.enum(["LECTURE", "WORK", "BUSINESS", "PERSONAL", "GYM"]).optional(),
});

const recurrenceSchema = z.object({
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
  days: z.array(z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"])),
}).refine(
  (data) => data.frequency !== "WEEKLY" || data.days.length > 0,
  {
    message: "days is required and must not be empty when frequency is WEEKLY",
    path: ["days"],
  }
);

export const baseEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(1000).nullable().optional(),
  context: z.enum(["LECTURE", "WORK", "BUSINESS", "PERSONAL", "GYM"]),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  isRecurring: z.boolean().default(false),
  recurrence: recurrenceSchema.nullable().optional(),
  location: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
});

export const createEventSchema = baseEventSchema;