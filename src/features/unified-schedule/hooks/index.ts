import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../services';
import type { ScheduleEvent, EventFormPayload } from '../types';

// Query Key Factory
export const scheduleKeys = {
  all: ['schedule'] as const,
  events: () => [...scheduleKeys.all, 'events'] as const,
};

export function useGetEvents() {
  return useQuery<ScheduleEvent[], Error>({
    queryKey: scheduleKeys.events(),
    queryFn: fetchEvents,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation<ScheduleEvent, Error, EventFormPayload>({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.events() });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation<ScheduleEvent, Error, { id: string; payload: EventFormPayload }>({
    mutationFn: ({ id, payload }) => updateEvent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.events() });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation<string, Error, string>({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.events() });
    },
  });
}
