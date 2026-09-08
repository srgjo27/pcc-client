import { ENDPOINTS } from '@/constants/endpoints';
import { axiosClient } from '@/services/axiosClient';
import type { ApiResponse } from '@/shared/types/api';
import { fetchTasks } from '@/features/to-do/services';
import type { Note, NoteInput, NoteTask } from '../types';

interface BackendNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  tasks?: Array<{ id: string }>;
  createdAt: string;
  updatedAt: string;
}

export const quickNotesService = {
  getNotes: async (params?: { q?: string; tag?: string }): Promise<Note[]> => {
    const response = await axiosClient.get<ApiResponse<BackendNote[]>>(
      ENDPOINTS.NOTE.NOTES,
      { params }
    );
    return (response.data.data || []).map((note) => ({
      ...note,
      taskId: note.tasks?.[0]?.id || '',
    }));
  },

  getTasks: async (): Promise<NoteTask[]> => {
    const tasks = await fetchTasks();
    return tasks.map((t) => {
      let contextMapped: 'college' | 'work' | 'business' | 'personal' = 'personal';
      const ctx = t.context.toUpperCase();
      if (ctx === 'LECTURE') contextMapped = 'college';
      else if (ctx === 'WORK') contextMapped = 'work';
      else if (ctx === 'BUSINESS') contextMapped = 'business';
      else if (ctx === 'PERSONAL') contextMapped = 'personal';

      let priorityMapped: 'high' | 'medium' | 'low' = 'medium';
      const prio = t.priority.toUpperCase();
      if (prio === 'HIGH' || prio === 'URGENT') priorityMapped = 'high';
      else if (prio === 'MEDIUM') priorityMapped = 'medium';
      else if (prio === 'LOW') priorityMapped = 'low';

      return {
        id: t.id,
        title: t.title,
        priority: priorityMapped,
        context: contextMapped,
      };
    });
  },

  createNote: async (input: NoteInput): Promise<Note> => {
    const { taskId, ...rest } = input;
    const taskIds = taskId ? [taskId] : [];
    const response = await axiosClient.post<ApiResponse<BackendNote>>(
      ENDPOINTS.NOTE.CREATE,
      { ...rest, taskIds }
    );
    const note = response.data.data;
    return {
      ...note,
      taskId: note.tasks?.[0]?.id || '',
    };
  },

  updateNote: async ({ id, input }: { id: string; input: Partial<NoteInput> }): Promise<Note> => {
    const { taskId, ...rest } = input;
    const taskIds = taskId !== undefined ? (taskId ? [taskId] : []) : undefined;
    const response = await axiosClient.patch<ApiResponse<BackendNote>>(
      ENDPOINTS.NOTE.UPDATE.replace('{id}', id),
      { ...rest, ...(taskIds !== undefined && { taskIds }) }
    );
    const note = response.data.data;
    return {
      ...note,
      taskId: taskId ?? note.tasks?.[0]?.id ?? '',
    };
  },

  deleteNote: async (id: string): Promise<boolean> => {
    await axiosClient.delete<ApiResponse<null>>(
      ENDPOINTS.NOTE.REMOVE.replace('{id}', id)
    );
    return true;
  }
};
