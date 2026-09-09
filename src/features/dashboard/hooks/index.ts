import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '../services';
import type { QuickAddNotePayload } from '../types';
import type { TaskPayload } from '@/features/to-do';

export const DASHBOARD_KEYS = {
  all: ['dashboard'] as const,
  dailyOverview: () => [...DASHBOARD_KEYS.all, 'daily-overview'] as const,
};

export const useGetDailyOverview = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.dailyOverview(),
    queryFn: () => dashboardService.getDailyOverview(),
  });
};

export const useQuickAddTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TaskPayload) => dashboardService.quickAddTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useQuickAddNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: QuickAddNotePayload) => dashboardService.quickAddNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};
