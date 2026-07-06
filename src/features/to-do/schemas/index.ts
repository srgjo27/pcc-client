import { z } from "zod";

export const tasksParamsSchema = z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    status: z.string().optional(),
});