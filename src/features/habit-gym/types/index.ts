import { z } from 'zod';
import { habitSchema } from '../schemas';

export type HabitFrequency = 'DAILY' | 'WEEKLY';

export interface Habit {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  icon: string | null;
  frequency: HabitFrequency;
  targetDays: number[];
  color: string | null;
  isActive: boolean;
}

export type HabitInput = z.infer<typeof habitSchema>;

export interface BackendStreak {
  habitId: string;
  name: string;
  icon: string | null;
  color: string | null;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
}

export interface BackendHabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  note: string | null;
  createdAt: string;
}
