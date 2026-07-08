import { z } from "zod";

export const eventsParamsSchema = z.object({
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  context: z.enum(["LECTURE", "WORK", "BUSINESS", "PERSONAL", "GYM"]).optional(),
});