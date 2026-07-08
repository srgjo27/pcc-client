import { z } from "zod"
import type { eventsParamsSchema } from "../schemas"

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