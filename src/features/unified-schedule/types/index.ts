import { z } from "zod"
import type { baseEventSchema, eventsParamsSchema } from "../schemas"

export interface Event {
  id: string,
  userId: string,
  title: string,
  description: string,
  context: string,
  startTime: string,
  endTime: string,
  isRecurring: boolean,
  recurrence: {
    days: string[],
    frequency: string,
  }
  location: string,
  color: string,
  createdAt: string,
  updatedAt: string,
}

export type EventsParams = z.infer<typeof eventsParamsSchema>

export type EventPayload = z.input<typeof baseEventSchema>

export enum TimeInterval {
  MONTH = "month",
  WEEK = "week",
  DAY = "day",
}