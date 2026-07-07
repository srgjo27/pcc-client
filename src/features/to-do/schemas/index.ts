import { z } from "zod";

export const tasksParamsSchema = z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    status: z.string().optional(),
});

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().max(1500, "Description: maximum 1,500 characters").nullable().optional(),
    context: z.enum(["LECTURE", "WORK", "BUSINESS", "PERSONAL"], { message: "Context is required" }),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"], { message: "Priority is required" }),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELLED"], { message: "Status is required" }),
    dueDate: z.preprocess(
        (val) => (val === "" ? null : val),
        z.coerce.date().nullable().optional()
    ),
    dueTime: z.string().nullable().optional(),
    tags: z.preprocess(
        (val) => {
            if (typeof val === 'string') {
                return val ? val.split(',').map(tag => tag.trim()).filter(Boolean) : [];
            }
            return val;
        },
        z.array(z.string()).default([])
    ),
});