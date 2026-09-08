import { z } from 'zod';
import { noteSchema } from '../schemas';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  taskId?: string;
  createdAt: string;
  updatedAt: string;
}

export type NoteInput = z.infer<typeof noteSchema>;

export interface NoteTask {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  context: 'college' | 'work' | 'business' | 'personal';
}
