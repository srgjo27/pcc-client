import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { focusService } from '../services';
import type { FocusTimerSettings, FocusSession } from '../types';

const FOCUS_KEYS = {
  settings: ['focus', 'settings'] as const,
  tasks: ['focus', 'tasks'] as const,
  sessions: ['focus', 'sessions'] as const,
  stats: ['focus', 'stats'] as const,
};

export const useGetFocusSettings = () => {
  return useQuery({
    queryKey: FOCUS_KEYS.settings,
    queryFn: () => focusService.getSettings(),
  });
};

export const useSaveFocusSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: FocusTimerSettings) => focusService.saveSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOCUS_KEYS.settings });
    },
  });
};

export const useGetFocusTasks = () => {
  return useQuery({
    queryKey: FOCUS_KEYS.tasks,
    queryFn: () => focusService.getTasks(),
  });
};

export const useCreateFocusTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title: string) => focusService.createTask(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOCUS_KEYS.tasks });
    },
  });
};

export const useGetFocusSessions = () => {
  return useQuery({
    queryKey: FOCUS_KEYS.sessions,
    queryFn: () => focusService.getFocusSessions(),
  });
};

export const useCreateFocusSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (session: Omit<FocusSession, 'id' | 'completedAt'>) =>
      focusService.createFocusSession(session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOCUS_KEYS.sessions });
      queryClient.invalidateQueries({ queryKey: FOCUS_KEYS.stats });
      queryClient.invalidateQueries({ queryKey: FOCUS_KEYS.tasks });
    },
  });
};

export const useGetFocusStats = () => {
  return useQuery({
    queryKey: FOCUS_KEYS.stats,
    queryFn: () => focusService.getDailyStats(),
  });
};
