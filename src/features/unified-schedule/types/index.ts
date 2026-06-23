export type EventContext = 'college' | 'work' | 'business' | 'personal';

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  context: EventContext;
  startDate: string; // ISO date-time string
  endDate: string; // ISO date-time string
  isRecurring: boolean;
  recurringDays?: number[]; // Days of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  recurringEndDate?: string; // Optional: ISO date string for when recurrence stops
}

export interface ScheduleEventOccurrence extends ScheduleEvent {
  occurrenceId: string; // unique ID for specific occurrence e.g. `${id}-${dateString}`
  actualStartDate: string; // ISO date-time string specific to this occurrence
  actualEndDate: string; // ISO date-time string specific to this occurrence
}

export type { EventFormPayload } from '../schemas';
