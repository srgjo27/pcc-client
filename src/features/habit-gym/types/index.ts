import { z } from 'zod';
import { habitSchema } from '../schemas';

export interface Habit {
  id: string;
  name: string;
  icon: string; // lucide icon name (e.g. Dumbbell, Book, Moon, Droplet)
  frequency: 'daily' | 'custom';
  frequencyDays: number[]; // Array of days (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  streak: number;
  lastCheckIn: string | null; // Date string YYYY-MM-DD
  checkInHistory: Record<string, boolean>; // key: YYYY-MM-DD, value: true/false
  createdAt: string;
}

export type HabitInput = z.infer<typeof habitSchema>;
