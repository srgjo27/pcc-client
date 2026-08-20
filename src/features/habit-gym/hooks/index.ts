import { useMutation, useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import { habitGymService } from '../services';
import type { HabitInput } from '../types';

const HABIT_KEYS = {
  all: ['habits'] as const,
};

export const useGetHabits = () => {
  return useQuery({
    queryKey: HABIT_KEYS.all,
    queryFn: () => habitGymService.getHabits(),
  });
};

export const useGetStreaks = () => {
  return useQuery({
    queryKey: [...HABIT_KEYS.all, 'streaks'] as const,
    queryFn: () => habitGymService.getStreaks(),
  });
};

export const useGetHabitsLogs = (habitIds: string[]) => {
  return useQueries({
    queries: habitIds.map((id) => ({
      queryKey: [...HABIT_KEYS.all, 'logs', id] as const,
      queryFn: () => habitGymService.getHabitLogs(id),
      enabled: habitIds.length > 0,
    })),
  });
};

export const useCreateHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: HabitInput) => habitGymService.createHabit(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABIT_KEYS.all });
    },
  });
};

export const useCheckInHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dateStr, isChecked }: { id: string; dateStr: string; isChecked: boolean }) =>
      habitGymService.toggleCheckIn(id, dateStr, isChecked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABIT_KEYS.all });
    },
  });
};

export const useDeleteHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => habitGymService.deleteHabit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABIT_KEYS.all });
    },
  });
};
