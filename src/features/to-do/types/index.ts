import { z } from "zod";
import type { createTaskSchema, tasksParamsSchema } from "../schemas";

export type TasksParams = z.infer<typeof tasksParamsSchema>;

export type TaskPayload = z.input<typeof createTaskSchema>;

export interface Task {
    id: string,
    userId: string,
    title: string,
    description: string,
    context: string,
    priority: string,
    status: string,
    dueDate: string,
    dueTime: string,
    tags: string[],
    createdAt: string,
    updatedAt: string,
}

export enum Context {
    LECTURE = 'LECTURE',
    WORK = 'WORK',
    BUSINESS = 'BUSINESS',
    PERSONAL = 'PERSONAL',
}

export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

export enum Status {
    TODO = 'DOBO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    CANCELLED = 'CANCELLED',
}