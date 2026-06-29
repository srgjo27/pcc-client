import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { habitGymService } from '../services';
import type { HabitInput } from '../types';

// Query keys factory
const HABIT_KEYS = {
  all: ['habits'] as const,
};

export const useGetHabits = () => {
  return useQuery({
    queryKey: HABIT_KEYS.all,
    queryFn: () => habitGymService.getHabits(),
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
    mutationFn: ({ id, dateStr }: { id: string; dateStr: string }) =>
      habitGymService.toggleCheckIn(id, dateStr),
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
