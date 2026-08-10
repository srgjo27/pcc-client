import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quickNotesService } from '../services';
import type { NoteInput } from '../types';

// Query Key Factory
export const quickNotesKeys = {
  all: ['quick-notes'] as const,
  notes: (params?: { q?: string; tag?: string }) => [...quickNotesKeys.all, 'notes', params] as const,
  tasks: () => [...quickNotesKeys.all, 'tasks'] as const,
};

export const useGetNotes = (params?: { q?: string; tag?: string }) => {
  return useQuery({
    queryKey: quickNotesKeys.notes(params),
    queryFn: () => quickNotesService.getNotes(params),
  });
};

export const useGetTasks = () => {
  return useQuery({
    queryKey: quickNotesKeys.tasks(),
    queryFn: quickNotesService.getTasks,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NoteInput) => quickNotesService.createNote(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quickNotesKeys.notes() });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<NoteInput> }) =>
      quickNotesService.updateNote({ id, input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quickNotesKeys.notes() });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => quickNotesService.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quickNotesKeys.notes() });
    },
  });
};
